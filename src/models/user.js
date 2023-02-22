import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  passwordHash: String,
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
});

userSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    delete returnedObject.passwordHash;
  },
});

userSchema.plugin(uniqueValidator, { message: "{PATH} must be unique" });

export const User = mongoose.model("User", userSchema);
