import express from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import env from "dotenv";
env.config();

import "./config/dbConfig.js";
import apiRoute from "./routes/index.js";
import YAML from "yamljs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const app = express();

// CORSの設定
const configureCors = () => {
  return cors({
    origin: process.env.WEB_APP_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });
};

// ミドルウェアの設定
const configureMiddleware = () => {
  app.use(express.json());
  app.use("/api", apiRoute);
};

// Swaggerの設定
const configureSwagger = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const yamlPath = path.join(__dirname, "./swagger/swagger.yaml");
  const swaggerDocument = YAML.load(yamlPath);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

// アプリケーションの設定
const configureApp = () => {
  app.use(configureCors());
  configureMiddleware();
  configureSwagger();
};

configureApp();

export default app;
