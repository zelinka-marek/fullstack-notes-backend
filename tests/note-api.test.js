import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import supertest from "supertest";
import { afterAll, beforeEach, describe, expect, test } from "vitest";
import { app } from "../src/app.js";
import { Note } from "../src/models/note.js";
import { User } from "../src/models/user.js";
import {
  getNonExistingNoteId,
  getNotesFromDatabase,
  getUsersFromDatabase,
  initialNotes,
} from "./note-api-helpers.js";

const api = supertest(app);

beforeEach(async () => {
  await Note.deleteMany();
  await Note.insertMany(initialNotes);
});

describe("when there are initially some notes saved", () => {
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
    expect(contents).toContain(initialNotes[1].content);
  });

  describe("viewing a specific note", () => {
    test("succeeds with a valid id", async () => {
      const notesAtStart = await getNotesFromDatabase();
      const noteToView = notesAtStart[0];

      const response = await api.get(`/api/notes/${noteToView.id}`);
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toMatch(/application\/json/);
      expect(response.body).toStrictEqual(noteToView);
    });

    test("fails with status 404 if note doesn't exist", async () => {
      const validNonExistingId = await getNonExistingNoteId();

      const response = await api.get(`/api/notes/${validNonExistingId}`);
      expect(response.status).toBe(404);
    });

    test("fails with status 400 if id is malformatted", async () => {
      const invalidId = "5a3d5da59invalid82a3445";

      const response = await api.get(`/api/notes/${invalidId}`);
      expect(response.status).toBe(400);
    });
  });

  describe("adding a new note", () => {
    test("succeeds with valid data", async () => {
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
      expect(contents).toContain(validNote.content);
    });

    test("fails with status 400 if data is invalid", async () => {
      const invalidNote = { important: true };

      const response = await api.post("/api/notes").send(invalidNote);
      expect(response.status).toBe(400);

      const notesAtEnd = await getNotesFromDatabase();
      expect(notesAtEnd).toHaveLength(initialNotes.length);
    });
  });

  describe("deleting a specific note", () => {
    test("succeeds with status 204 if id is valid", async () => {
      const notesAtStart = await getNotesFromDatabase();
      const noteToDelete = notesAtStart[0];

      const response = await api.delete(`/api/notes/${noteToDelete.id}`);
      expect(response.status).toBe(204);

      const notesAtEnd = await getNotesFromDatabase();
      expect(notesAtEnd).toHaveLength(notesAtStart.length - 1);

      const contents = notesAtEnd.map((note) => note.content);
      expect(contents).not.toContain(noteToDelete.content);
    });
  });
});

describe("when there is initially one user saved", () => {
  beforeEach(async () => {
    await User.deleteMany();
    const passwordHash = await bcrypt.hash("sekret", 10);
    await new User({ username: "root", passwordHash }).save();
  });

  describe("adding a new note", () => {
    test("succeeds with a fresh username", async () => {
      const usersAtStart = await getUsersFromDatabase();

      const validUser = {
        username: "mluukkai",
        name: "Matti Luukkainen",
        password: "salainen",
      };

      const response = await api.post(`/api/users`).send(validUser);
      expect(response.status).toBe(201);
      expect(response.headers["content-type"]).toMatch(/application\/json/);

      const usersAtEnd = await getUsersFromDatabase();
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

      const usernames = usersAtEnd.map((user) => user.username);
      expect(usernames).toContain(validUser.username);
    });

    test("fails with status 400 if username is taken", async () => {
      const usersAtStart = await getUsersFromDatabase();

      const invalidUser = {
        username: "root",
        name: "Superuser",
        password: "salainen",
      };

      const response = await api.post(`/api/users`).send(invalidUser);
      expect(response.status).toBe(400);
      expect(response.headers["content-type"]).toMatch(/application\/json/);
      expect(response.body.errors.username).toMatch(/username must be unique/i);

      const usersAtEnd = await getUsersFromDatabase();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
