# Task Manager API

REST API para gerenciamento de tarefas desenvolvida com **Node.js**, **TypeScript**, **Express**, **Prisma ORM** e **PostgreSQL**.

Este projeto permite:
- cadastro e autenticação de usuários com JWT
- gerenciamento de tarefas por usuário (CRUD completo)
- filtros, ordenação e paginação de tarefas

---

## 🚀 Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Zod
- JWT (`jsonwebtoken`)
- Bcrypt
- Vitest

---

## ✅ Funcionalidades

### Autenticação
- Registrar usuário com email e senha
- Login com email e senha
- Geração de token JWT

### Usuários
- Buscar perfil do usuário autenticado (`/users/me`)
- Atualizar perfil do usuário autenticado
- Remover conta do usuário autenticado

### Tarefas
- Criar tarefa vinculada ao usuário autenticado
- Listar tarefas do usuário autenticado
- Buscar tarefa por ID (somente do próprio usuário)
- Atualizar tarefa (somente do próprio usuário)
- Remover tarefa (somente do próprio usuário)
- Marcar como concluída ou pendente (`done`)
- Definir prioridade (`HIGH` / `LOW`)
- Definir prazo de entrega (`dueDate`)
- Filtrar, ordenar e paginar tarefas em `GET /tasks`

---

## 📁 Estrutura do projeto

```txt
src/
  controllers/
  database/
  middlewares/
  repositories/
  routes/
  schemas/
  services/
  tests/
  types/
  utils/
  index.ts
```

---

## ⚙️ Instalação

### 1) Clone o repositório

```bash
git clone https://github.com/joaopedrodev21/Manager-tasks-server.git
cd Manager-tasks-server
```

### 2) Instale as dependências

```bash
npm install
```

### 3) Configure variáveis de ambiente

Crie um arquivo `.env` na raiz com base no `.env.example`:

```env
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="your_jwt_secret_key"
JWT_EXPIRES_IN="1h"
```

### 4) Banco de dados

Execute migrations e gere o client:

```bash
npx prisma migrate dev
npx prisma generate
```

---

## ▶️ Executar projeto

### Desenvolvimento

```bash
npm run dev
```

Servidor:

```txt
http://localhost:3000
```

---

## 📮 Rotas principais

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Usuários
- `GET /users/me`
- `PUT /users/me`
- `DELETE /users/me`

### Tarefas
- `POST /tasks`
- `GET /tasks`
- `GET /tasks/:id`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

#### Query params de `GET /tasks`
- `done=true|false`
- `priority=HIGH|LOW`
- `page=1`
- `limit=10`
- `sortBy=createdAt|dueDate|priority`
- `order=asc|desc`

Exemplo:

```txt
GET /tasks?done=false&priority=HIGH&page=1&limit=10&sortBy=dueDate&order=asc
```

---

## 🔐 Observações de segurança e integridade

- Rotas de usuários e tarefas são protegidas por JWT (middleware de autenticação)
- Relação `Task -> User` com `onDelete: Cascade` para evitar registros órfãos

---

## 🧪 Testes

### Rodar testes uma vez

```bash
npm test
```

### Rodar em modo watch

```bash
npm run test:watch
```

Atualmente há cobertura mínima de autenticação:
- register ok / duplicado
- login ok / senha inválida
- middleware auth sem token / token inválido / token válido

---

## 🛠️ Ferramentas de teste manual

As requisições também podem ser testadas via **Insomnia** ou **Postman**.

---

## 👨‍💻 Autor

João Pedro
