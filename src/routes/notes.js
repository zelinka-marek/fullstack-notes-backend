import express from "express";
import jwt from "jsonwebtoken";
import { Note } from "../models/note.js";
import { User } from "../models/user.js";
import { SECRET } from "../utils/config.js";

export const noteRouter = express.Router();

noteRouter.get("/", async (_request, response) => {
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 });

  response.json(notes);
});

noteRouter.get("/:id", async (request, response) => {
  const note = await Note.findById(request.params.id);
  if (!note) {
    return response.status(404).end();
  }

  response.json(note);
});

noteRouter.post("/", async (request, response) => {
  const data = request.body;

  const decodedToken = jwt.verify(request.token, SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "invalid token" });
  }

  const user = await User.findById(decodedToken.id);

  const note = await new Note({
    content: data.content,
    important: data.important ?? false,
    user: user.id,
  }).save();

  user.notes = user.notes.concat(note._id);
  await user.save();

  response.status(201).json(note);
});

noteRouter.delete("/:id", async (request, response) => {
  await Note.findByIdAndDelete(request.params.id);

  response.status(204).end();
});

noteRouter.put("/:id", (request, response) => {
  const data = request.body;

  Note.findByIdAndUpdate(
    request.params.id,
    { content: data.content, important: data.important },
    { new: true, runValidators: true }
  ).then((updatedNote) => response.json(updatedNote));
});
