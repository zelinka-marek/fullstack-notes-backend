import mongoose from "mongoose";
import supertest from "supertest";
import { afterAll, beforeEach, expect, test } from "vitest";
import { app } from "../src/app.js";
import { Note } from "../src/models/note.js";

const api = supertest(app);

const mockNotes = [
  { content: "HTML is easy" },
  { content: "Browsers can execute only JavaScript", important: true },
];

beforeEach(async () => {
  await Note.deleteMany();
  await Note.insertMany(mockNotes);
});

test("notes are returned as json", async () => {
  const response = await api.get("/api/notes");

  expect(response.statusCode).toBe(200);
  expect(response.headers["content-type"]).toMatch(/application\/json/);
});

test("all notes are returned", async () => {
  const response = await api.get("/api/notes");

  expect(response.body).toHaveLength(mockNotes.length);
});

test("a specific note is within the returned notes", async () => {
  const response = await api.get("/api/notes");

  const contents = response.body.map((note) => note.content);
  expect(contents).toContain(mockNotes[1].content);
});

afterAll(() => {
  mongoose.connection.close();
});
