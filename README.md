Task Manager API

REST API para gerenciamento de tarefas desenvolvida com Node.js, TypeScript, Express, Prisma ORM e PostgreSQL.

Este projeto permite o cadastro de usuários e gerenciamento de tarefas com prioridade, status e prazo de entrega.

-Tecnologias utilizadas:

Node.js
TypeScript
Express
Prisma ORM
PostgreSQL
Zod

- Funcionalidades:

Autenticação
Registrar usuário com email e senha
Login com email e senha (JWT)

Usuários
Buscar perfil do usuário autenticado
Atualizar perfil do usuário autenticado
Remover conta do usuário autenticado

Tarefas
Criar tarefa vinculada a um usuário
Listar tarefas do usuário autenticado
Buscar tarefa por ID (somente do próprio usuário)
Atualizar tarefa (somente do próprio usuário)
Remover tarefa (somente do próprio usuário)
Marcar como concluída ou pendente
Definir prioridade:
HIGH
LOW
Definir prazo de entrega

📁 Estrutura do projeto
src/
 ├── controllers/
 ├── database/
 ├── repositories/
 ├── routes/
 ├── schemas/
 └── index.ts

Instalação:

Clone o repositório:

git clone https://github.com/seu-usuario/task-manager-api.git

Entre na pasta:

cd task-manager-api

Instale as dependências:

npm install
🔐 Variáveis de ambiente

Crie um arquivo .env na raiz:

DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
JWT_SECRET="seu_segredo_super_seguro"
🗄️ Banco de dados

Execute as migrations:

npx prisma migrate dev

Gerar client Prisma:

npx prisma generate
▶️ Executar projeto

Modo desenvolvimento:

npm run dev

Servidor rodando em:

http://localhost:3000
📮 Rotas principais
Auth
POST   /auth/register
POST   /auth/login

Usuários
GET    /users/me
PUT    /users/me
DELETE /users/me

Tarefas
POST   /tasks
GET    /tasks
GET    /tasks/:id
PUT    /tasks/:id
DELETE /tasks/:id

🧪 Testes de API:

As requisições foram testadas utilizando Insomnia.

Aprendizados aplicados:
CRUD completo com API REST
Relacionamento entre tabelas
Organização em padrão MVC
Validação com Zod
Integração com banco relacional
Versionamento com Git
🚀 Melhorias futuras
Frontend com React
Filtros de tarefas
Dashboard visual
Deploy online
👨‍💻 Autor

João Pedro