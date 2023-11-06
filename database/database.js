import mongoose from "mongoose";

export function connectDatabase() {
  mongoose.connect(process.env.DB_URI).then((con) => {
    console.log(`Connected to database at ${con.connection.host}.`);
  });
}
