import express from "express";
import { Note } from "../models/note.js";

export const notesRouter = express.Router();

notesRouter.get("/", async (_request, response, next) => {
  try {
    const notes = await Note.find();

    response.json(notes);
  } catch (error) {
    next(error);
  }
});

notesRouter.get("/:id", async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id);
    if (!note) {
      return response.status(404).end();
    }

    response.json(note);
  } catch (error) {
    next(error);
  }
});

notesRouter.post("/", async (request, response, next) => {
  try {
    const data = request.body;

    const note = new Note({
      content: data.content,
      important: data.important ?? false,
    });
    const savedNote = await note.save();

    response.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }
});

notesRouter.delete("/:id", async (request, response, next) => {
  try {
    await Note.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

notesRouter.put("/:id", (request, response, next) => {
  const data = request.body;

  Note.findByIdAndUpdate(
    request.params.id,
    { content: data.content, important: data.important },
    { new: true, runValidators: true }
  )
    .then((updatedNote) => response.json(updatedNote))
    .catch(next);
});
