import cors from "cors";
import express from "express";
import { Note } from "./models/note.js";

const port = process.env.PORT;
if (!port) {
  throw new Error("PORT must be set");
}

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

function generateNoteId() {
  const maxId = notes.length ? Math.max(...notes.map((note) => note.id)) : 0;

  return maxId + 1;
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

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

app.get("/api/notes/:id", (request, response) => {
  const { id } = request.params;

  Note.findById(id).then((note) => {
    response.json(note);
  });
});

app.delete("/api/notes/:id", (request, response) => {
  const { id } = request.params;

  notes = notes.filter((note) => note.id !== Number(id));

  response.status(204).end();
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

app.listen(port, () => console.log(`Server running on port ${port}`));
