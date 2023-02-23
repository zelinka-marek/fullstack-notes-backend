import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: [4, "Username must be at least 4 characters long"],
    required: [true, "User name is required"],
    trim: true,
    unique: true,
    validate: {
      validator: (value) =>
        /^[a-z._]+$/i.test(value) &&
        !value.startsWith(".") &&
        !value.startsWith("_") &&
        !value.endsWith(".") &&
        !value.endsWith("_") &&
        !value.includes("..") &&
        !value.startsWith("__") &&
        !value.startsWith("._") &&
        !value.startsWith("_."),
      message: "Username must contain only permitted characters",
    },
  },
  name: String,
  passwordHash: String,
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
});

userSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

userSchema.plugin(uniqueValidator, { message: "{PATH} must be unique" });

export const User = mongoose.model("User", userSchema);
