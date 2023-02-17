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

app.get("/api/notes", (_request, response) => {
  Note.find().then((notes) => response.json(notes));
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

app.delete("/api/notes/:id", (request, response) => {
  const { id } = request.params;

  Note.findByIdAndDelete(id).then(() => {
    response.status(204).end();
  });
});

app.post("/api/notes", (request, response) => {
  const data = request.body;
  if (!data.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: data.content,
    important: data.important ?? false,
  });

  note.save().then((savedNote) => {
    response.status(201).json(savedNote);
  });
});

function unknownEndpoint(_request, response) {
  response.status(404).end();
}

app.use(unknownEndpoint);

function errorHandler(error, _request, response, next) {
  console.error(error);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" });
  }

  next(error);
}

app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
