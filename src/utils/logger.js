export function logInfo(...params) {
  if (process.env.NODE_ENV !== "test") {
    console.log(...params);
  }
}

export function logError(...params) {
  if (process.env.NODE_ENV !== "test") {
    console.error(...params);
  }
}
