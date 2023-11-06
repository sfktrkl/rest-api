import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const app = express();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(
    `Server started on port ${PORT} in ${process.env.NODE_ENV} mode.`
  );
});
