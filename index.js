import express from "express";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import cookieParser from "cookie-parser";
import helmet from "helmet";
import xssClean from "xss-clean";

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
import profile from "./routes/profile.js";

const app = express();
const PORT = process.env.PORT;

app.use(helmet());
app.use(express.json());
app.use(mongoSanitize());
app.use(xssClean());
app.use(cookieParser());
app.use(fileUpload());
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
  })
);
app.use("/api/v1", jobs);
app.use("/api/v1", users);
app.use("/api/v1", profile);
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
