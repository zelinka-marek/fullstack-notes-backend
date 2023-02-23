import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: [5, "Content must be at least 5 characters long"],
    required: [true, "Content is required"],
    trim: true,
  },
  date: { type: Date, default: new Date() },
  important: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

noteSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const Note = mongoose.model("Note", noteSchema);
