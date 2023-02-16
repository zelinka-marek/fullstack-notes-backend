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

const app = express();

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

app.listen(port, () => console.log(`Server running on port ${port}`));
