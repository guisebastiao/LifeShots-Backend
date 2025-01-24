import dotenv from "dotenv";
import app from "./app";
dotenv.config();

app.listen(process.env.SERVER_PORT, "0.0.0.0", () =>
  console.log("Server Running")
);
