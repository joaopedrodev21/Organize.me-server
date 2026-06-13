# ============================================
# DOCKERFILE - Organize.me Server
# ============================================
# 
# O Dockerfile é a "receita" para construir a imagem do seu container.
# Ele define o ambiente exato onde sua aplicação vai rodar.
# 
# Vamos usar o conceito de MULTI-STAGE BUILD (várias etapas):
# 
# Stage 1 (BUILD): Compila o TypeScript para JavaScript
# Stage 2 (RUNTIME): Apenas o necessário pra rodar (imagem menor!)
#
# Isso é importante porque:
# - Imagem menor = sobe mais rápido no Render
# - Menos vulnerabilidades (só o essencial)
# - Mais profissional
# ============================================

# ---------- STAGE 1: BUILD ----------
# Usamos uma imagem "gorda" com ferramentas de desenvolvimento
# node:20-slim é uma versão leve mas com npm e ferramentas básicas
FROM node:20-slim AS build

# Instala OpenSSL (necessário para o Prisma Client)
RUN apt-get update -y && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho dentro do container
# Tudo que fizermos será dentro dessa pasta
WORKDIR /app

# Copia os arquivos de dependências PRIMEIRO
# Isso é estratégico: o Docker cria "camadas" (layers)
# Como package.json muda pouco, o Docker pode usar cache aqui
COPY package.json package-lock.json ./

# COPIA O PRISMA SCHEMA ANTES do npm ci!
# O postinstall do package.json roda "prisma generate" automaticamente.
# Se o schema não estiver presente, o comando quebra.
COPY prisma ./prisma

# Instala TODAS as dependências (incluindo devDependencies como TypeScript)
# O postinstall vai executar prisma generate com sucesso agora
RUN npm ci

# Copia o resto do código fonte
COPY . .

# Compila TypeScript para JavaScript (pasta dist/)
RUN npm run build

# ---------- STAGE 2: RUNTIME ----------
# Agora usamos uma imagem NOVA e mais leve SÓ com o necessário
FROM node:20-slim AS runtime

# Instala dependências do sistema necessárias para o Prisma
# O Prisma precisa de algumas bibliotecas para funcionar com PostgreSQL
RUN apt-get update -y && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia SÓ o necessário do stage anterior (build)
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma

# A porta que a aplicação vai usar (Render vai definir via variável PORT)
EXPOSE 3000

# Comando que roda quando o container inicia
# Primeiro roda as migrations, depois inicia o servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
