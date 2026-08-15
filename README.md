<div align="center">

# Organize.me

### Plataforma full stack para gerenciamento de projetos e métricas de produtividade em tempo real.

---

**Stack:** Node.js · TypeScript · Express · Prisma ORM · PostgreSQL · Docker · Vitest

</div>

---

## Sobre o Projeto

O **Organize.me** é uma plataforma full stack projetada para transformar a forma como equipes gerenciam projetos e acompanham métricas de produtividade. Com uma API REST robusta e escalável, o sistema oferece autenticação segura, gerenciamento completo de tarefas com filtros avançados, e uma arquitetura de engenharia de alto nível — pronta para produção.

---

## Destaques da Arquitetura & Engenharia

### Segurança

| Recurso | Implementação |
|---------|---------------|
| **Autenticação Stateless** | Tokens **JWT** (JSON Web Tokens) com expiração configurável, validados em middleware dedicado |
| **Hash de Senhas** | **bcrypt** com salt rounds (10) — senhas nunca armazenadas em texto puro |
| **Validação Rígida de Dados** | **Zod** schemas em todas as rotas (DTOs) — validação de entrada antes de qualquer operação no banco |
| **Proteção de Rotas** | Middleware `authMiddleware` protege todas as rotas de usuários e tarefas |
| **CORS Configurável** | Política de origem controlada via `CLIENT_URL` |
| **Recuperação de Senha** | Tokens criptograficamente aleatórios (`crypto.randomBytes(32)`) com expiração de 1 hora |

### Banco de Dados & ORM

- **Modelagem Relacional** no **PostgreSQL** via **Prisma ORM**
- **Integridade Referencial** garantida: `User → Task` com `ON DELETE CASCADE`
- **Migrations versionadas** — evolução do schema rastreável e reproduzível
- **Enum nativo** `Priority` (`LOW` / `HIGH`) no banco
- **Índices únicos** em `email` e `resetToken` para integridade de dados

```
┌─────────────┐       ┌─────────────┐
│    User     │       │    Task     │
├─────────────┤       ├─────────────┤
│ id          │ 1   N │ id          │
│ name        │──────▶│ title       │
│ email       │       │ description │
│ passwordHash│       │ done        │
│ resetToken  │       │ priority    │
│ resetTokenExp│      │ dueDate     │
│ createdAt   │       │ userId (FK) │
│ updatedAt   │       │ createdAt   │
└─────────────┘       │ updatedAt   │
                      └─────────────┘
```

### Qualidade & Testes

- **Suíte de testes unitários** automatizados com **Vitest**
- Cobertura das **regras de negócio críticas** do backend:
  - Registro de usuário (sucesso / email duplicado)
  - Login (sucesso / senha inválida)
  - Middleware de autenticação (sem token / token inválido / token válido)
- **Mocks isolados** de repositórios e dependências externas
- Execução rápida e integrada ao fluxo de desenvolvimento

### DevOps / DX

- **Contêinerização completa** com `docker-compose`
- **Multi-stage Dockerfile** — imagem de produção otimizada e enxuta
- **Healthcheck** do banco antes do app subir (`depends_on: service_healthy`)
- **Volumes persistentes** para dados do PostgreSQL
- **Scripts npm** dedicados para gerenciar o ambiente Docker
- **Hot-reload** em desenvolvimento com `tsx watch`

---

## Funcionalidades

### Autenticação
- Registro de usuário com nome, email e senha
- Login com geração de token JWT
- Recuperação de senha via email com token temporário (expira em 1h)
- Redefinição de senha com validação de token

### Usuários
- Buscar perfil do usuário autenticado (`GET /users/me`)
- Atualizar nome e/ou email (`PUT /users/me`)
- Remover conta com **cascade delete** de tarefas (`DELETE /users/me`)

### Tarefas
- CRUD completo de tarefas vinculadas ao usuário autenticado
- Marcar como concluída / pendente (`done`)
- Definir prioridade (`HIGH` / `LOW`)
- Definir prazo de entrega (`dueDate`)
- **Filtros avançados**: por status (`done`) e prioridade
- **Ordenação**: por `createdAt`, `dueDate` ou `priority`
- **Paginação**: com metadados (`total`, `page`, `limit`, `totalPages`)

### Health Check
- Endpoint `/health` para monitoramento de disponibilidade

---

## Tecnologias

| Categoria | Tecnologias |
|-----------|-------------|
| **Runtime** | Node.js 20 |
| **Linguagem** | TypeScript |
| **Framework** | Express |
| **ORM** | Prisma ORM |
| **Banco de Dados** | PostgreSQL 16 |
| **Validação** | Zod |
| **Autenticação** | JWT (jsonwebtoken) |
| **Segurança** | bcrypt |
| **Email** | Nodemailer |
| **Testes** | Vitest |
| **Containerização** | Docker + Docker Compose |

---

## Estrutura do Projeto

```txt
Organize.me-server/
├── prisma/
│   ├── migrations/          # Migrations versionadas do banco
│   └── schema.prisma        # Schema do Prisma ORM
├── src/
│   ├── controllers/         # Camada de controllers (HTTP)
│   ├── database/            # Cliente Prisma
│   ├── middlewares/         # Auth e tratamento de erros
│   ├── repositories/        # Camada de acesso a dados
│   ├── routes/              # Definição de rotas
│   ├── schemas/             # Schemas Zod (DTOs)
│   ├── services/            # Regras de negócio
│   ├── tests/               # Testes unitários (Vitest)
│   ├── types/               # Tipos TypeScript
│   ├── utils/               # Utilitários (AppError)
│   ├── app.ts               # Configuração do Express
│   └── index.ts             # Entry point
├── Dockerfile               # Multi-stage build
├── docker-compose.yml       # Orquestração de containers
├── .env.example             # Variáveis de ambiente de exemplo
└── package.json
```

---

## Instalação

### 1) Clone o repositório

```bash
git clone https://github.com/joaopedrodev21/Organize.me-server.git
cd Organize.me-server
```

### 2) Configure as variáveis de ambiente

```bash
cp .env.example .env
```

```env
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="your_jwt_secret_key"
JWT_EXPIRES_IN="1h"
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
SMTP_USER=seuemail@gmail.com
SMTP_PASS=sua_senha_de_app
CLIENT_URL=http://localhost:5173
```

### 3) Instale as dependências

```bash
npm install
```

### 4) Execute as migrations

```bash
npx prisma migrate dev
npx prisma generate
```

---

## Execução

### Com Docker (recomendado)

Sobe **banco + backend** de forma unificada:

```bash
npm run docker:up        # docker compose up -d
npm run docker:logs      # docker compose logs -f
npm run docker:down      # docker compose down
npm run docker:rebuild   # docker compose up -d --build
```

### Sem Docker (desenvolvimento)

```bash
npm run dev
```

Servidor disponível em: `http://localhost:3000`

### Produção

```bash
npm run build
npm start
```

---

## Rotas da API

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/auth/register` | Registrar novo usuário |
| `POST` | `/auth/login` | Login e geração de token JWT |
| `POST` | `/auth/forgot-password` | Solicitar recuperação de senha |
| `POST` | `/auth/reset-password` | Redefinir senha com token |

### Usuários *(protegidas por JWT)*

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/users/me` | Buscar perfil do usuário autenticado |
| `PUT` | `/users/me` | Atualizar nome/email |
| `DELETE` | `/users/me` | Remover conta (cascade nas tarefas) |

### Tarefas *(protegidas por JWT)*

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/tasks` | Listar tarefas com filtros e paginação |
| `POST` | `/tasks` | Criar nova tarefa |
| `GET` | `/tasks/:id` | Buscar tarefa por ID |
| `PUT` | `/tasks/:id` | Atualizar tarefa |
| `DELETE` | `/tasks/:id` | Remover tarefa |

### Health Check

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/health` | Status da API |

---

## Query Params de `GET /tasks`

| Parâmetro | Valores | Padrão | Descrição |
|-----------|---------|--------|-----------|
| `done` | `true` / `false` | — | Filtrar por status |
| `priority` | `LOW` / `HIGH` | — | Filtrar por prioridade |
| `page` | `1, 2, 3...` | `1` | Número da página |
| `limit` | `1–50` | `10` | Itens por página |
| `sortBy` | `createdAt` / `dueDate` / `priority` | `createdAt` | Campo de ordenação |
| `order` | `asc` / `desc` | `desc` | Direção da ordenação |

**Exemplo:**

```txt
GET /tasks?done=false&priority=HIGH&page=1&limit=10&sortBy=dueDate&order=asc
```

**Resposta:**

```json
{
  "items": [
    {
      "id": 1,
      "title": "Implementar autenticação",
      "description": "JWT + bcrypt",
      "done": false,
      "priority": "HIGH",
      "dueDate": "2026-08-15T00:00:00.000Z",
      "userId": 1,
      "createdAt": "2026-08-12T20:00:00.000Z",
      "updatedAt": "2026-08-12T20:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

## Exemplos de Requisições

### Registrar usuário

```json
POST /auth/register
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha12345"
}
```

### Login

```json
POST /auth/login
{
  "email": "joao@email.com",
  "password": "senha12345"
}
```

**Resposta:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "createdAt": "2026-08-12T20:00:00.000Z",
    "updatedAt": "2026-08-12T20:00:00.000Z"
  }
}
```

### Criar tarefa

```json
POST /tasks
Authorization: Bearer <token>

{
  "title": "Implementar dashboard",
  "description": "Criar visualização de métricas",
  "priority": "HIGH",
  "dueDate": "2026-08-20T00:00:00.000Z"
}
```

### Recuperação de senha

```json
POST /auth/forgot-password
{
  "email": "joao@email.com"
}
```

```json
POST /auth/reset-password
{
  "token": "token_recebido_por_email",
  "password": "novaSenha123"
}
```

---

## Testes

### Rodar testes uma vez

```bash
npm test
```

### Rodar em modo watch

```bash
npm run test:watch
```

### Cobertura atual

| Teste | Cenários |
|-------|----------|
| **AuthService** | Registro com sucesso / email duplicado · Login com sucesso / senha inválida |
| **AuthMiddleware** | Sem token / token inválido / token válido com `req.user` populado |

---

## Segurança em Detalhe

### Fluxo de Autenticação

```
Cliente ──POST /auth/login──▶ Validação Zod ──▶ bcrypt.compare ──▶ JWT sign
                                                                        │
Cliente ◀── { token, user } ────────────────────────────────────────────┘
                                                                        │
Cliente ──GET /tasks (Bearer token)──▶ authMiddleware ──▶ jwt.verify ──▶ req.user
                                                                        │
Cliente ◀── tasks ──────────────────────────────────────────────────────┘
```

### Validação de Dados (Zod)

Todas as rotas validam a entrada antes de qualquer operação:

- **Register**: nome (mín. 3), email válido, senha (mín. 8)
- **Login**: email válido, senha (mín. 8)
- **Create Task**: título obrigatório, prioridade enum, `dueDate` datetime ISO
- **Update Task**: pelo menos um campo obrigatório
- **Query Params**: coerção de tipos, limites e enums

### Tratamento de Erros

O middleware de erro centralizado retorna respostas padronizadas:

| Erro | Status | Formato |
|------|--------|---------|
| **ZodError** | `400` | `{ message, errors: [{ field, message }] }` |
| **AppError** | Custom | `{ message, details }` |
| **Erro interno** | `500` | `{ message: "Erro interno do servidor" }` |

---

## Docker Compose

O `docker-compose.yml` orquestra **dois serviços**:

| Serviço | Container | Porta | Descrição |
|---------|-----------|-------|-----------|
| `db` | `organize-me-db` | `5432` | PostgreSQL 16 Alpine com volume persistente |
| `app` | `organize-me-app` | `3000` | API Node.js com multi-stage build |

**Fluxo de inicialização:**

1. Container `db` sobe e executa healthcheck (`pg_isready`)
2. Container `app` aguarda o banco ficar saudável (`service_healthy`)
3. Migrations são aplicadas automaticamente (`prisma migrate deploy`)
4. Servidor inicia (`node dist/index.js`)

---

## Scripts npm

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Desenvolvimento com hot-reload (`tsx watch`) |
| `npm run build` | Compilar TypeScript para JavaScript |
| `npm start` | Rodar build de produção |
| `npm test` | Rodar testes unitários (Vitest) |
| `npm run test:watch` | Testes em modo watch |
| `npm run docker:up` | Subir containers em background |
| `npm run docker:down` | Parar e remover containers |
| `npm run docker:logs` | Ver logs em tempo real |
| `npm run docker:rebuild` | Rebuild e subir containers |

---
---

## Autor

**João Pedro** — [GitHub](https://github.com/joaopedrodev21)