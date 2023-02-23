import cors from "cors";
import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import { notesRouter } from "./routes/notes.js";
import { usersRouter } from "./routes/users.js";
import { MONGODB_URI } from "./utils/config.js";
import { logError, logInfo } from "./utils/logger.js";
import {
  errorHandler,
  requestLogger,
  unknownEndpoint,
} from "./utils/middleware.js";

mongoose.set("strictQuery", false);

logInfo("connecting to db", MONGODB_URI);
mongoose
  .connect(MONGODB_URI)
  .then(() => logInfo("connected to db"))
  .catch((error) => logError("error connecting to db:", error.message));

export const app = express();
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(requestLogger);

app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter);

app.use(unknownEndpoint);
app.use(errorHandler);
