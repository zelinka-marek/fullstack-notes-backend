import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
if (!PORT) {
  throw new Error("PORT must be set");
}

export const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI;
if (process.env.NODE_ENV === "test" && !TEST_MONGODB_URI) {
  throw new Error("TEST_MONGODB_URI must be set");
}

export const MONGODB_URI =
  process.env.NODE_ENV === "test" ? TEST_MONGODB_URI : process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI must be set");
}
