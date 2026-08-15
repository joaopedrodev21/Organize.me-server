/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "João Pedro"
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     UpdateUserInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           example: "João Pedro Silva"
 *         email:
 *           type: string
 *           format: email
 *           example: "novo@example.com"
 *       description: "Envie ao menos um campo para atualizar"
 */

export {};