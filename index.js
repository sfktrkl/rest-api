import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import cookieParser from "cookie-parser";

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutdown server due to uncaught exception.");
  process.exit(1);
});

import { connectDatabase } from "./database/database.js";
connectDatabase();

import { errorMiddleware } from "./middlewares/errors.js";
import { ErrorHandler } from "./utils/errorHandler.js";

import jobs from "./routes/jobs.js";
import users from "./routes/users.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", jobs);
app.use("/api/v1", users);
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});
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
