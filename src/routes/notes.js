import express from "express";
import { Note } from "../models/note.js";

export const notesRouter = express.Router();

notesRouter.get("/", (_request, response, next) => {
  Note.find()
    .then((notes) => response.json(notes))
    .catch(next);
});

notesRouter.get("/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (!note) {
        return response.status(404).end();
      }

      response.json(note);
    })
    .catch(next);
});

notesRouter.post("/", (request, response, next) => {
  const data = request.body;

  new Note({
    content: data.content,
    important: data.important ?? false,
  })
    .save()
    .then((savedNote) => response.status(201).json(savedNote))
    .catch(next);
});

notesRouter.delete("/:id", (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch(next);
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
