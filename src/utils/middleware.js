import { logError, logInfo } from "./logger.js";

export function requestLogger(request, _response, next) {
  logInfo("Method:", request.method);
  logInfo("Path:", request.path);
  logInfo("Body:", request.body);
  logInfo("---");

  next();
}

export function unknownEndpoint(_request, response) {
  response.status(404).end();
}

export function errorHandler(error, _request, response, next) {
  logError(error);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    const errors = {};

    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });

    return response.status(400).json({ errors });
  }

  next(error);
}
