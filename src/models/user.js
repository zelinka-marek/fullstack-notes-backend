import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
});

userSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    delete returnedObject.passwordHash;
  },
});

export const User = mongoose.model("User", userSchema);
