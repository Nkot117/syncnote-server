import express from "express";
import cors from "cors";
import env from "dotenv";
env.config();

import "./config/dbConfig.js";
import apiRoute from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: process.env.WEB_APP_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/api", apiRoute);

export default app;
