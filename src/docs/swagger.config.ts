import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";
import { existsSync } from "node:fs";
import { baseOptions } from "./swagger.options.js";

// No container Docker (multi-stage build), o diretório src/ não existe.
// Apenas o dist/ (compilado) é copiado. Detectamos isso dinamicamente.
const hasSource = existsSync("./src/docs");

const options = {
  ...baseOptions,
  apis: hasSource
    ? ["./src/docs/**/*.ts", "./src/routes/*.ts", "./src/controllers/*.ts"]
    : ["./dist/docs/**/*.js", "./dist/routes/*.js", "./dist/controllers/*.js"]
};

export const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      swaggerOptions: {
        persistAuthorization: true
      }
    })
  );

  app.get("/api/docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}