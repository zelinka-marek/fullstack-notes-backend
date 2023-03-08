import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.js";

export const userRouter = express.Router();

userRouter.get("/", async (_request, response) => {
  const users = await User.find().populate("notes", {
    content: 1,
    important: 1,
  });

  response.json(users);
});

userRouter.post("/", async (request, response) => {
  const data = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(data.password, saltRounds);

  const user = await new User({
    username: data.username,
    name: data.name,
    passwordHash,
  }).save();

  response.status(201).json(user);
});
