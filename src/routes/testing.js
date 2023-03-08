import express from "express";
import { Note } from "../models/note.js";
import { User } from "../models/user.js";

export const testRouter = express.Router();

testRouter.post("/reset", async (_request, response) => {
  await User.deleteMany();
  await Note.deleteMany();

  response.status(204).end();
});
