import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { connectDatabase } from "./database/database.js";
connectDatabase();

import jobs from "./routes/jobs.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/api/v1", jobs);
app.listen(PORT, () => {
  console.log(
    `Server started on port ${PORT} in ${process.env.NODE_ENV} mode.`
  );
});
