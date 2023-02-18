import cors from "cors";
import express from "express";
import { Note } from "./models/note.js";

const port = process.env.PORT;
if (!port) {
  throw new Error("PORT must be set");
}

const app = express();
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

function requestLogger(request, _response, next) {
  console.log("Method:", request.method);
  console.log("Path:", request.path);
  console.log("Body:", request.body);
  console.log("---");

  next();
}

app.use(requestLogger);

app.get("/api/notes", (_request, response, next) => {
  Note.find()
    .then((notes) => {
      response.json(notes);
    })
    .catch(next);
});

app.get("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;

  Note.findById(id)
    .then((note) => {
      if (!note) {
        return response.status(404).end();
      }

      response.json(note);
    })
    .catch(next);
});

app.delete("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;

  Note.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end();
    })
    .catch(next);
});

app.post("/api/notes", (request, response, next) => {
  const data = request.body;

  new Note({
    content: data.content,
    important: data.important ?? false,
  })
    .save()
    .then((savedNote) => {
      response.status(201).json(savedNote);
    })
    .catch(next);
});

app.put("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;
  const data = request.body;

  Note.findByIdAndUpdate(
    id,
    { content: data.content, important: data.important },
    { new: true, runValidators: true }
  )
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch(next);
});

function unknownEndpoint(_request, response) {
  response.status(404).end();
}

app.use(unknownEndpoint);

function errorHandler(error, _request, response, next) {
  console.error(error);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    const errors = {};

    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });

    return response.status(400).json({ errors });
  }

  next(error);
}

app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
