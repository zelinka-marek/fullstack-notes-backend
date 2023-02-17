import cors from "cors";
import express from "express";

const port = process.env.PORT ?? 3001;

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
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const { id } = request.params;

  const note = notes.find((note) => note.id === Number(id));
  if (!note) {
    return response.status(404).end();
  }

  response.json(note);
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

  const note = {
    id: generateNoteId(),
    content: data.content,
    important: data.important ?? false,
  };

  notes = notes.concat(note);

  response.status(201).json(note);
});

function unknownEndpoint(_request, response) {
  response.status(404).end();
}

app.use(unknownEndpoint);

app.listen(port, () => console.log(`Server running on port ${port}`));
