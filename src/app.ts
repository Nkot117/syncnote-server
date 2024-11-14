import express, { Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import * as OpenApiValidator from "express-openapi-validator";
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
  setupSwagger();
  app.use("/api", apiRoute);
};

const setupSwagger = () => {
  const document = getSwaggerYamlDocument();

  app.use(
    OpenApiValidator.middleware({
      apiSpec: document,
      validateRequests: true,
      validateResponses: true,
    })
  );

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
    });
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(document));
}

const getSwaggerYamlDocument = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const yamlPath = path.join(__dirname, "./swagger/swagger.yaml");
  return YAML.load(yamlPath);
}; 

// アプリケーションの設定
const configureApp = () => {
  app.use(configureCors());
  configureMiddleware();
};

configureApp();

export default app;
