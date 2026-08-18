 /**
 * @openapi
 * /users/me:
 *   get:
 *     tags: [Users]
 *     summary: Obter usuário autenticado
 *     description: Retorna os dados do usuário autenticado.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       401:
 *         description: Token não informado ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *
 *   put:
 *     tags: [Users]
 *     summary: Atualizar usuário autenticado
 *     description: Atualiza nome e/ou email do usuário autenticado.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateUserInput"
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Token não informado ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *
 *   delete:
 *     tags: [Users]
 *     summary: Excluir usuário autenticado
 *     description: Exclui a conta do usuário autenticado e todas as suas tarefas.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Usuário excluído com sucesso (sem corpo)
 *       401:
 *         description: Token não informado ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

export {};