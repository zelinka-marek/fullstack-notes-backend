import mongoose from "mongoose";

if (process.argv.length < 3) {
  console.error("Error: password is missing");
  console.error("usage: node mongo.js <password>");
  process.exit(1);
}

const password = process.argv[2];

function connect() {
  const uri = `mongodb+srv://user:${password}@cluster0.10skx.mongodb.net/fullstack-notes?retryWrites=true&w=majority`;

  mongoose.set("strictQuery", false);
  mongoose.connect(uri);
}

function disconnect() {
  mongoose.connection.close();
  process.exit(0);
}

connect();

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

/** Creating notes */
// const note = new Note({
//   content: "CSS is Easy",
//   important: Math.random() > 0.5,
// });

// note.save().then((result) => {
//   console.log("note saved!", result.toJSON());
//   disconnect();
// });

/** Fetching notes */
Note.find({ important: false }).then((result) => {
  for (const note of result) {
    console.log(note.toJSON());
  }

  disconnect();
});
