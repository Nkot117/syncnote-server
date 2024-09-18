import express from "express";
import env from "dotenv";
env.config();

import "./config/dbConfig.js";
import apiRoute from "./routes/index.js";

const app = express();
app.use(express.json());
app.use("/api", apiRoute);

export default app;
