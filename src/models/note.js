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
});

export const Note = mongoose.model("Note", noteSchema);
