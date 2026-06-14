# 🚀 Guia de Deploy - Organize.me Server (Docker + Render)

## 📌 Índice

1. [Pré-requisitos](#1-pré-requisitos)
2. [Testar Localmente com Docker](#2-testar-localmente-com-docker)
3. [Preparar o Repositório no GitHub](#3-preparar-o-repositório-no-github)
4. [Criar Banco de Dados no Render](#4-criar-banco-de-dados-no-render)
5. [Fazer o Deploy da Aplicação no Render](#5-fazer-o-deploy-da-aplicação-no-render)
6. [Verificar se Está Funcionando](#6-verificar-se-está-funcionando)
7. [Comandos Úteis do Docker](#7-comandos-úteis-do-docker)

---

## 1️⃣ Pré-requisitos

Antes de começar, instale o que falta no seu PC:

### ✅ Docker Desktop (para Windows)
- Baixe em: https://www.docker.com/products/docker-desktop/
- **Importante**: Ative a virtualização na BIOS e instale o WSL 2
- Após instalar, o Docker Desktop precisa ficar **rodando em background**

### ✅ Git
- Já está instalado (detectamos `git` no seu sistema)

### ✅ Conta no GitHub
- Seu repositório já está configurado: `joaopedrodev21/Organize.me-server`

---

## 2️⃣ Testar Localmente com Docker

Primeiro, vamos testar se tudo funciona no seu computador.

### 2.1. Iniciar o Docker Desktop
- Abra o **Docker Desktop** no Menu Iniciar
- Aguarde ele ficar verde (pronto)
- Verifique no terminal:

```bash
docker version
```

### 2.2. Buildar a imagem Docker

```bash
docker build -t organize-me-server .
```

> **Explicação**: `docker build` constrói a imagem seguindo a receita do `Dockerfile`. A tag `-t organize-me-server` dá um nome pra imagem.

### 2.3. Subir tudo com Docker Compose (aplicação + banco)

```bash
docker compose up -d
```

> **O que acontece aqui?**
> - O Compose lê o `docker-compose.yml`
> - Cria um container com **PostgreSQL** (banco de dados)
> - Cria um container com **sua aplicação Node**
> - Os containers se enxergam numa rede interna
> - O banco fica pronto primeiro (healthcheck)
> - A aplicação só sobe depois do banco

### 2.4. Verificar se está no ar

```bash
# Ver logs da aplicação
docker compose logs -f app

# Testar o health check
curl http://localhost:3000/health

# Testar a API
curl http://localhost:3000/
```

### 2.5. Parar tudo quando terminar

```bash
docker compose down
```

---

## 3️⃣ Preparar o Repositório no GitHub

Antes de fazer deploy, precisamos enviar as alterações para o GitHub.

```bash
# Ver o que foi modificado
git status

# Adicionar os novos arquivos
git add Dockerfile .dockerignore docker-compose.yml package.json src/routes/main.ts

# Commitar
git commit -m "feat: add Docker support and health check endpoint"

# Enviar pro GitHub
git push origin main
```

> **Dica**: O Render vai usar o repositório do GitHub como fonte para o deploy.

---

## 4️⃣ Criar Banco de Dados no Render

O Render oferece PostgreSQL gerenciado (eles cuidam das manutenções).

### Passo a passo:

1. Acesse https://dashboard.render.com
2. Crie uma conta (se não tiver)
3. Clique em **"New +"** → **"PostgreSQL"**

![Render - Criar PostgreSQL](https://render.com/images/docs/postgres-create.png)

4. Preencha:
   - **Name**: `organize-me-db`
   - **Database**: `organize_me_db`
   - **User**: `organize_user`
   - **Region**: `São Paulo (South America)` → *mais perto = mais rápido*
   - **Plan**: `Free` → *para começar, depois pode upgradear*

Features: Improved overall responsiveness, addition of a navigation menu on smaller screens, and implementation of a landing page showcasing the application.
5. Clique em **"Create Database"**

6. Após criar, anote a **"Internal Database URL"** (vamos usar no passo 5)
   - Algo como: `postgresql://organize_user:senha@render-host:5432/organize_me_db`

> ⚠️ **IMPORTANTE**: Com o plano Free, o banco "dorme" após 30 dias sem uso. Acesse o dashboard periodicamente para manter ativo.

---

## 5️⃣ Fazer o Deploy da Aplicação no Render

### 5.1. Criar o Web Service

1. No dashboard do Render, clique em **"New +"** → **"Web Service"**
2. Escolha **"Build and deploy from a Git repository"**
3. Conecte com o GitHub e selecione `Organize.me-server`
4. Clique em **"Connect"**

### 5.2. Configurar o Serviço

Preencha os campos:

| Campo | Valor |
|-------|-------|
| **Name** | `organize-me-server` |
| **Region** | `São Paulo (South America)` |
| **Branch** | `main` |
| **Runtime** | `Docker` |
| **Plan** | `Free` |

### 5.3. Variáveis de Ambiente

Clique em **"Advanced"** e depois **"Add Environment Variable"**.

Adicione **TODAS** essas variáveis:

| Variável | Valor | Exemplo |
|----------|-------|---------|
| `DATABASE_URL` | Internal Database URL do passo 4 | `postgresql://organize_user:senha@host:5432/organize_me_db` |
| `JWT_SECRET` | Uma senha forte aleatória | `a1b2c3d4e5f6...` (use algo complexo!) |
| `JWT_EXPIRES_IN` | Tempo de expiração do token | `1h` |
| `CLIENT_URL` | URL do frontend (se houver) | `https://seu-frontend.onrender.com` |
| `PORT` | Porta (Render define automático) | Deixe vazio ou `10000` |

> 🔐 **Dica de JWT_SECRET**: Gere uma chave forte com:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 5.4. Finalizar

Clique em **"Create Web Service"**.

### 5.5. Aguardar o Build

O Render vai:
1. Conectar no seu GitHub
2. Baixar o código
3. Executar o Dockerfile (build)
4. Iniciar o container
5. Rodar as migrations do Prisma

Isso leva de **3 a 5 minutos** na primeira vez.

Você vai ver os logs em tempo real no dashboard!

---

## 6️⃣ Verificar se Está Funcionando

Assim que o deploy terminar, o Render mostra a URL do seu serviço:

```
https://organize-me-server.onrender.com
```

Teste:

```bash
# Health check
curl https://organize-me-server.onrender.com/health

# Resposta esperada:
# {"status":"OK","timestamp":"2026-06-13T18:00:00.000Z"}

# API rodando
curl https://organize-me-server.onrender.com/

# Resposta esperada:
# API is running
```

### Testar funcionalidades:

```bash
# Criar usuário
curl -X POST https://organize-me-server.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@email.com","password":"123456"}'

# Login
curl -X POST https://organize-me-server.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"123456"}'
  # Vai retornar um token JWT
```

---

## 7️⃣ Comandos Úteis do Docker

### Gerenciamento geral

```bash
# Ver imagens no seu PC
docker images

# Ver containers rodando
docker ps

# Ver TODOS os containers (incluindo parados)
docker ps -a

# Parar um container específico
docker stop organize-me-app

# Remover container
docker rm organize-me-app

# Remover imagem
docker rmi organize-me-server
```

### Docker Compose (atalhos no package.json)

```bash
# Subir tudo (modo background)
npm run docker:up

# Ver logs
npm run docker:logs

# Reconstruir e subir (útil após alterações)
npm run docker:rebuild

# Parar tudo
npm run docker:down
```

### Limpeza geral (se precisar recomeçar)

```bash
# Para tudo e remove volumes (DADOS DO BANCO SÃO PERDIDOS!)
docker compose down -v

# Limpa imagens não usadas
docker system prune -a
```

---

## 🎯 Resumo do Fluxo Completo

```
1. Instalar Docker Desktop
2. Testar localmente: docker compose up -d
3. Fazer git push para o GitHub
4. Criar PostgreSQL no Render
5. Criar Web Service no Render (conectado ao GitHub)
6. Configurar variáveis de ambiente
7. Aguardar o build (3-5 min)
8. Testar a URL gerada pelo Render
```

---

---

## 8️⃣ Como Evitar que o Render "Durma" (Plano Gratuito)

### ⚠️ O Problema
O plano **Free** do Render desliga o servidor após **15 minutos sem requisições**. Quando alguém acessa, leva **~30 segundos** para "acordar" (isso se chama *cold start*).

### ✅ Soluções para manter o servidor ativo

#### Opção 1 - UptimeRobot (serviço grátis - RECOMENDADO) 🏆

**Melhor opção!** Serviço 100% grátis que faz pings automáticos de fora.

1. Acesse https://uptimerobot.com
2. Crie conta grátis
3. Clique em **"Add New Monitor"**
4. Configure:
   - **Monitor Type**: `HTTP(s)` 
   - **Friendly Name**: `Organize.me API`
   - **URL**: `https://seu-app.onrender.com/health`
   - **Interval**: `5 minutes`
5. Clique em **"Create Monitor"** ✅

**Vantagens:**
- Funciona 24/7 sem depender do seu PC
- Ainda te avisa se o site cair de verdade
- Grátis para até 50 monitores

#### Opção 3 - Ping desde o frontend (se tiver)

Se você tiver um frontend hospedado, pode adicionar no código:

```javascript
// No frontend React/Vue, usar setInterval para ping
setInterval(async () => {
  await fetch("https://seu-app.onrender.com/health");
}, 10 * 60 * 1000); // a cada 10 minutos
```

### 📊 Comparativo das opções

| Opção | Grátis | Não precisa do PC | Fácil de configurar |
|-------|--------|-------------------|---------------------|
| UptimeRobot 🏆 | ✅ | ✅ | ✅ |
| Ping do frontend | ✅ | ✅ | ⚠️ (precisa frontend) |

> 💡 **Minha recomendação**: Use o **UptimeRobot**. É 100% grátis, funciona 24h sem depender do seu PC e ainda te avisa se o servidor cair!

---

## 🆘 Problemas Comuns

### ❌ Docker não conecta
- Solução: Abra o **Docker Desktop** manualmente

### ❌ "PrismaClientInitializationError"
- Solução: Verifique se `DATABASE_URL` está correta nas variáveis de ambiente do Render

### ❌ Porta já em uso
- Solução: Mude a porta mapeada no `docker-compose.yml` (ex: `"3001:3000"`)

### ❌ Build falha no Render
- Solução: Olhe os logs no dashboard do Render. Pode ser variável de ambiente faltando

---

## 📚 Conceitos Importantes (Didático)

### O que é um Container?
Uma "caixa" isolada que contém sua aplicação + tudo que ela precisa pra rodar (Node, dependências, arquivos). Diferente de uma máquina virtual, o container **compartilha o sistema operacional** com o host, sendo mais leve.

### O que é uma Imagem?
A "receita" congelada do container. A imagem é construída pelo Dockerfile e pode ser enviada para qualquer lugar (como o Render).

### Dockerfile vs docker-compose.yml
- **Dockerfile**: Define como construir a imagem da **sua aplicação**
- **docker-compose.yml**: Orquestra **vários containers** juntos (ex: sua app + banco de dados)

### Por que Multi-stage Build?
Duas etapas: uma "gorda" com ferramentas de build (TypeScript, npm) e outra "magra" só com o necessário pra rodar (JavaScript compilado). Resultado: imagem **~80% menor**!

---

Bom deploy! 🚀