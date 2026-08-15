import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";
import { baseOptions } from "./swagger.options.js";

const options = {
  ...baseOptions,
  apis: ["./src/docs/**/*.ts", "./src/routes/*.ts", "./src/controllers/*.ts"]
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