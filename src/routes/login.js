import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { SECRET } from "../utils/config.js";

export const loginRouter = express.Router();

loginRouter.post("/", async (request, response) => {
  const data = request.body;

  const user = await User.findOne({ username: data.username });
  const passwordCorrect = !user
    ? false
    : bcrypt.compare(data.password, user.passwordHash);
  if (!passwordCorrect) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const token = jwt.sign({ id: user._id, username: user.username }, SECRET, {
    expiresIn: "7d",
  });

  response.json({ token, username: user.username, name: user.name });
});
