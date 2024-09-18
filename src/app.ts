import express from "express";
import env from "dotenv";
env.config();

import "./config/dbConfig.js";
const app = express();
export default app;
