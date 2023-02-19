import { Note } from "../src/models/note.js";

export const initialNotes = [
  { content: "HTML is easy" },
  { content: "Browsers can execute only JavaScript", important: true },
];

export async function getNonExistingNoteId() {
  const note = new Note({ content: "willremovethissoon" });

  await note.save();
  await note.delete();

  return note._id.toString();
}

export async function getNotesFromDatabase() {
  const notes = await Note.find();

  return notes.map((note) => JSON.parse(JSON.stringify(note.toJSON())));
}
