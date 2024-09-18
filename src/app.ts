import express from "express";
import env from "dotenv";
env.config();

const app = express();
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server Start! PORT=${port}`);
});
