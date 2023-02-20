import mongoose from "mongoose";
import supertest from "supertest";
import { afterAll, beforeEach, expect, test } from "vitest";
import { app } from "../src/app.js";
import { Note } from "../src/models/note.js";
import { getNotesFromDatabase, initialNotes } from "./test-helpers.js";

const api = supertest(app);

beforeEach(async () => {
  await Note.deleteMany();
  await Note.insertMany(initialNotes);
});

test("notes are returned as json", async () => {
  const response = await api.get("/api/notes");
  expect(response.status).toBe(200);
  expect(response.headers["content-type"]).toMatch(/application\/json/);
});

test("all notes are returned", async () => {
  const response = await api.get("/api/notes");
  expect(response.body).toHaveLength(initialNotes.length);
});

test("a specific note is within the returned notes", async () => {
  const response = await api.get("/api/notes");
  const contents = response.body.map((note) => note.content);
  expect(contents).toContainEqual(initialNotes[1].content);
});

test("a valid note can be added", async () => {
  const validNote = {
    content: "async/await simplifies making async calls",
    important: true,
  };

  const response = await api.post("/api/notes").send(validNote);
  expect(response.status).toBe(201);
  expect(response.headers["content-type"]).toMatch(/application\/json/);

  const notesAtEnd = await getNotesFromDatabase();
  expect(notesAtEnd).toHaveLength(initialNotes.length + 1);
  const contents = notesAtEnd.map((note) => note.content);
  expect(contents).toContainEqual(validNote.content);
});

test("note without content is not added", async () => {
  const invalidNote = { important: true };

  const response = await api.post("/api/notes").send(invalidNote);
  expect(response.status).toBe(400);

  const notesAtEnd = await getNotesFromDatabase();
  expect(notesAtEnd).toHaveLength(initialNotes.length);
});

test("a specific note can be viewed", async () => {
  const notesAtStart = await getNotesFromDatabase();
  const noteToView = notesAtStart[0];

  const response = await api.get(`/api/notes/${noteToView.id}`);
  expect(response.status).toBe(200);
  expect(response.headers["content-type"]).toMatch(/application\/json/);
  expect(response.body).toStrictEqual(noteToView);
});

test("a note can be deleted", async () => {
  const notesAtStart = await getNotesFromDatabase();
  const noteToDelete = notesAtStart[0];

  const response = await api.delete(`/api/notes/${noteToDelete.id}`);
  expect(response.status).toBe(204);

  const notesAtEnd = await getNotesFromDatabase();
  expect(notesAtEnd).toHaveLength(initialNotes.length - 1);
  const contents = notesAtEnd.map((note) => note.content);
  expect(contents).not.toContainEqual(noteToDelete.content);
});

afterAll(() => {
  mongoose.connection.close();
});
