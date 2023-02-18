export const PORT = process.env.PORT;
if (!PORT) {
  throw new Error("PORT must be set");
}

export const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI must be set");
}
