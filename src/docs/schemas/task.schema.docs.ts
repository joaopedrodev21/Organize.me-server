/**
 * @openapi
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - done
 *         - priority
 *         - userId
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Estudar TypeScript"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Capítulo 3 - Tipos avançados"
 *         done:
 *           type: boolean
 *           default: false
 *           example: false
 *         priority:
 *           type: string
 *           enum: [LOW, HIGH]
 *           default: LOW
 *           example: HIGH
 *         userId:
 *           type: integer
 *           example: 1
 *         dueDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2026-08-20T18:00:00.000Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateTaskInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           example: "Nova tarefa"
 *         description:
 *           type: string
 *           example: "Descrição opcional"
 *         done:
 *           type: boolean
 *           default: false
 *           example: false
 *         priority:
 *           type: string
 *           enum: [LOW, HIGH]
 *           default: LOW
 *           example: LOW
 *         dueDate:
 *           type: string
 *           format: date-time
 *           example: "2026-08-20T18:00:00.000Z"
 *     UpdateTaskInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           example: "Título atualizado"
 *         description:
 *           type: string
 *           example: "Descrição atualizada"
 *         done:
 *           type: boolean
 *           example: true
 *         priority:
 *           type: string
 *           enum: [LOW, HIGH]
 *           example: HIGH
 *         dueDate:
 *           type: string
 *           format: date-time
 *           example: "2026-08-25T18:00:00.000Z"
 *       description: "Envie ao menos um campo para atualizar"
 *     TaskListResponse:
 *       type: object
 *       required:
 *         - items
 *         - meta
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Task"
 *         meta:
 *           type: object
 *           required:
 *             - total
 *             - page
 *             - limit
 *             - totalPages
 *           properties:
 *             total:
 *               type: integer
 *               example: 25
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 10
 *             totalPages:
 *               type: integer
 *               example: 3
 */

export {};