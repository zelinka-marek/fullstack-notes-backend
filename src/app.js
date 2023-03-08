import cors from "cors";
import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import { loginRouter } from "./routes/login.js";
import { noteRouter } from "./routes/notes.js";
import { userRouter } from "./routes/users.js";
import { MONGODB_URI } from "./utils/config.js";
import { logError, logInfo } from "./utils/logger.js";
import {
  errorHandler,
  requestLogger,
  tokenExtractor,
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
app.use(tokenExtractor);

app.use("/api/notes", noteRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
if (process.env.NODE_ENV === "test") {
  const { testRouter } = await import("./routes/testing.js");
  app.use("/api/testing", testRouter);
}

app.use(unknownEndpoint);
app.use(errorHandler);
