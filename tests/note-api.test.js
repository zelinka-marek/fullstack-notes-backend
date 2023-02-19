import mongoose from "mongoose";
import supertest from "supertest";
import { afterAll, expect, test } from "vitest";
import { app } from "../src/app";

const api = supertest(app);

test("notes are returned as json", async () => {
  const response = await api.get("/api/notes");

  expect(response.statusCode).toBe(200);
  expect(response.headers["content-type"]).toMatch(/application\/json/);
});

test("there are two notes", async () => {
  const response = await api.get("/api/notes");

  expect(response.body).toHaveLength(2);
});

test("the first note is about HTML", async () => {
  const response = await api.get("/api/notes");

  expect(response.body[0].content).toBe("HTML is Easy");
});

afterAll(() => {
  mongoose.connection.close();
});
