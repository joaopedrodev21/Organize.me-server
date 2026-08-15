import type { Options } from "swagger-jsdoc";

export const baseOptions: Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Organize.me API",
      version: "1.0.0",
      description:
        "API de gerenciamento de projetos e tarefas (Task Management) com autenticação JWT.\n\n" +
        "## Autenticação\n" +
        "A maioria dos endpoints exige um token JWT no header:\n\n" +
        "```\nAuthorization: Bearer <seu-token-jwt>\n```\n\n" +
        "Obtenha o token fazendo login em `POST /auth/login` ou criando uma conta em `POST /auth/register`.",
      contact: {
        name: "Organize.me",
        url: "https://github.com/joaopedrodev21/Organize.me-server"
      },
      license: {
        name: "ISC"
      }
    },
    servers: [
      {
        url: process.env.API_URL ?? "http://localhost:3000",
        description: "Servidor local"
      }
    ],
    tags: [
      {
        name: "Auth",
        description: "Operações de autenticação e recuperação de senha"
      },
      {
        name: "Tasks",
        description: "CRUD de tarefas (requer autenticação)"
      },
      {
        name: "Users",
        description: "Gerenciamento do usuário autenticado (requer autenticação)"
      },
      {
        name: "Health",
        description: "Verificação de saúde da API"
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Token JWT obtido em POST /auth/login ou POST /auth/register"
        }
      }
    },
    security: []
  }
};