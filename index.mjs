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

app.listen(port, () => console.log(`Server running on port ${port}`));
