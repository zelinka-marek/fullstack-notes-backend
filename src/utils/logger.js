export function logInfo(...params) {
  if (process.env.NODE_END !== "test") {
    console.log(...params);
  }
}

export function logError(...params) {
  if (process.env.NODE_END !== "test") {
    console.error(...params);
  }
}
