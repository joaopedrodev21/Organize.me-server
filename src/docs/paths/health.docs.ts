/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Verificar saúde da API
 *     description: Retorna o status da API e o timestamp atual.
 *     responses:
 *       200:
 *         description: API saudável
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - status
 *                 - timestamp
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-08-15T12:00:00.000Z"
 */

export {};