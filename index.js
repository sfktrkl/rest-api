import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutdown server due to uncaught exception.");
  process.exit(1);
});

import { connectDatabase } from "./database/database.js";
connectDatabase();

import { errorMiddleware } from "./middlewares/errors.js";

import jobs from "./routes/jobs.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/api/v1", jobs);
app.use(errorMiddleware);
const server = app.listen(PORT, () => {
  console.log(
    `Server started on port ${PORT} in ${process.env.NODE_ENV} mode.`
  );
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutdown server due to unhandled promise rejection.");
  server.close(() => {
    process.exit(1);
  });
});
