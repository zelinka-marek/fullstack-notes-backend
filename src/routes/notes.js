import express from "express";
import { Note } from "../models/note.js";

export const notesRouter = express.Router();

notesRouter.get("/", async (_request, response) => {
  const notes = await Note.find();

  response.json(notes);
});

notesRouter.get("/:id", async (request, response) => {
  const note = await Note.findById(request.params.id);
  if (!note) {
    return response.status(404).end();
  }

  response.json(note);
});

notesRouter.post("/", async (request, response) => {
  const data = request.body;

  const note = await new Note({
    content: data.content,
    important: data.important ?? false,
  }).save();

  response.status(201).json(note);
});

notesRouter.delete("/:id", async (request, response) => {
  await Note.findByIdAndDelete(request.params.id);

  response.status(204).end();
});

notesRouter.put("/:id", (request, response) => {
  const data = request.body;

  Note.findByIdAndUpdate(
    request.params.id,
    { content: data.content, important: data.important },
    { new: true, runValidators: true }
  ).then((updatedNote) => response.json(updatedNote));
});
