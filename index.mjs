import express from "express";

const port = 3001;

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
app.use(express.json());

app.get("/", (_request, response) => {
  response.send("<h1>Hello World!</h1>");
});

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

app.listen(port, () => console.log(`Server running on port ${port}`));
