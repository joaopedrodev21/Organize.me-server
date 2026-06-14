# 📚 Resumo Didático - Docker + Render: Do Zero ao Deploy

## 🎯 O que fizemos e por quê?

```
Problema:    O projeto Organize.me rodava apenas localmente.
              Cada pessoa que fosse instalar precisaria configurar
              Node, PostgreSQL, dependências manualmente.

Solução:     Docker = "empacotar" a aplicação com tudo que ela precisa
              pra rodar em qualquer lugar, sem dor de cabeça.

Deploy:      Render = plataforma que hospeda containers na nuvem,
              como se fosse a "Netflix" da sua aplicação.
```

---

## 🧱 Os 3 Pilares do que Criamos

### 1️⃣ Dockerfile — "A Receita do Bolo"

**O que é?** Um arquivo de instruções que diz ao Docker como construir a imagem da sua aplicação.

**Por que multi-stage (2 etapas)?**

```
┌─────────────────────────────────────────────────────────┐
│  STAGE 1: BUILD (a "cozinha")                           │
│  ───────────────────────────────────────────             │
│  - Pega o Node + TypeScript + Ferramentas de build       │
│  - Instala dependências                                  │
│  - Gera o Prisma Client                                  │
│  - Compila TypeScript → JavaScript (pasta dist/)         │
│  - No final, essa etapa é DESCARTADA                     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  STAGE 2: RUNTIME (o "prato pronto")                    │
│  ───────────────────────────────────────────             │
│  - Pega SÓ o resultado do build (dist/)                  │
│  - Imagem muito menor (~200MB vs 800MB)                  │
│  - Menos vulnerabilidades, sobe mais rápido              │
│  - Comando final: migrate + start server                 │
└─────────────────────────────────────────────────────────┘
```

**Erro que aconteceu e como corrigimos:**
```
❌ npm ci falhou → "prisma schema not found"
   Motivo: O postinstall do package.json executa "prisma generate",
           mas o schema.prisma ainda não estava no container.
   Correção: Copiar a pasta prisma/ ANTES de rodar npm ci ✅
```

### 2️⃣ docker-compose.yml — "O Maestro da Orquestra"

**O que é?** Um arquivo que sobe VÁRIOS containers juntos com 1 comando.

**O que ele faz?**
```yaml
services:
  db:       # Container 1: PostgreSQL
    image: postgres:16-alpine
    healthcheck: "Só fica pronto quando o banco aceitar conexões"
    
  app:      # Container 2: Sua aplicação Node
    build: Dockerfile
    depends_on: "Só sobe depois do db estar saudável"
```

**Por que usar?**
- Sem Compose: precisaria rodar 2 comandos separados
- Com Compose: `docker compose up -d` sobe TUDO

**Conceito chave - DNS interno:**
```
No docker-compose, o nome "db" vira um endereço de rede!
Então DATABASE_URL usa "db" como host:
  postgresql://user:pass@db:5432/banco
Isso funciona DENTRO do Docker, mas não fora.
```

### 3️⃣ .dockerignore — "A Peneira"

**O que é?** Igual ao .gitignore, mas para o Docker.

**O que ele filtra?**
```
node_modules → já serão instaladas DENTRO do container
.env         → cada ambiente (dev/prod) tem seu próprio .env
dist/        → vamos compilar dentro do container
.git/        → código fonte não precisa do histórico do git
```

---

## 🐳 Como o Docker Funciona (Visão Geral)

```
┌─────────────────────────────────────────────────────────┐
│                    DOCKER ARCHITECTURE                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐    ┌──────────────┐                    │
│  │  Container A  │    │  Container B  │                    │
│  │  (App Node)   │    │  (PostgreSQL) │                    │
│  │  Porta 3000   │    │  Porta 5432   │                    │
│  │              │    │              │                    │
│  │  │││││││││││││    │  │││││││││││││                    │
│  └──────┬───────┘    └──────┬───────┘                    │
│         │                   │                            │
│         └───── Rede ────────┘                            │
│              Interna                                      │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │           DOCKER ENGINE (Motor)                    │   │
│  │  Gerencia containers, imagens, redes, volumes     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │           SISTEMA OPERACIONAL (Windows/Linux)      │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Conceitos essenciais:**
- **Container**: Uma "caixa" isolada rodando sua aplicação
- **Imagem**: O "molde" para criar containers (como um ISO)
- **Volume**: Disco persistente (dados sobrevivem mesmo se container reiniciar)
- **Porta**: Container tem suas portas internas, mapeamos para o computador host

---

## ☁️ Como o Render se Encaja

```
SEU PC                           RENDER (Nuvem)
───────                          ────────────────
                                   ┌─────────────────┐
Código no GitHub ──push──▶         │  Git Repository  │
                                   └────────┬────────┘
                                            │
                                   ┌────────▼────────┐
                                   │  Docker Build    │
                                   │  (Dockerfile)   │
                                   └────────┬────────┘
                                            │
                                   ┌────────▼────────┐
                                   │  PostgreSQL      │
                                   │  (Serviço à     │
                                   │   parte)        │
                                   └────────┬────────┘
                                            │
                                   ┌────────▼────────┐
                                   │  Web Service     │
                                   │  (Container     │
                                   │   rodando)      │
                                   │  Porta 443 (HTTPS)│
                                   └─────────────────┘
                                            │
Você acessa: https://organize-me.onrender.com
```

---

## 📂 O que Cada Arquivo Novo Faz

| Arquivo | Função | Você Precisa Mexer? |
|---------|--------|---------------------|
| `Dockerfile` | Receita para construir a imagem | Raramente (só se mudar versão do Node) |
| `.dockerignore` | Filtra o que não vai pro Docker | Quase nunca |
| `docker-compose.yml` | Sobe tudo localmente | Só se quiser mudar portas/senhas |
| `DEPLOY_GUIDE.md` | Tutorial completo do deploy | Seu guia de referência |
| `package.json` (modificado) | Scripts docker + postinstall | Adicionados `npm run docker:*` |

### O que mudou em cada arquivo existente:

**package.json** → Adicionamos:
```json
"postinstall": "prisma generate"  // Gera Prisma Client automaticamente
"docker:up": "docker compose up -d"
"docker:down": "docker compose down"
"docker:logs": "docker compose logs -f"
"docker:rebuild": "docker compose up -d --build"
```

**src/routes/main.ts** → Adicionamos:
```typescript
router.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});
```
*O Render usa esse endpoint para saber se a aplicação está saudável*

---

## 🎬 Linha do Tempo do que Fizemos

```
1. Análise do projeto
   ├── Verificamos package.json, tsconfig, Prisma, Express
   └── Identificamos o que precisava ser criado

2. Criação dos arquivos
   ├── Dockerfile (com explicações em comentários)
   ├── .dockerignore
   ├── docker-compose.yml
   └── Health check endpoint

3. Correção de erro
   ├── Build falhou → prisma/schema não encontrado
   └── Corrigimos: copiar prisma/ antes do npm ci

4. Build com sucesso
   └── Imagem de 199MB criada em 29 segundos

5. Teste local com Docker Compose
   ├── Subiu PostgreSQL + Aplicação
   ├── Health check: ✅ 200 OK
   ├── Migrations: ✅ 6 aplicadas
   └── API rodando na porta 3000

6. Commit e Push
   └── Branch dev → GitHub (sem o DEPLOY_GUIDE.md)
```

---

## 🚀 Próximos Passos (Você)

```
                    ┌─────────────────────────────┐
                    │  1. Ir no render.com        │
                    │  2. Criar PostgreSQL         │
                    │  3. Copiar Internal DB URL   │
                    └──────────┬──────────────────┘
                               │
                    ┌──────────▼──────────────────┐
                    │  4. Criar Web Service        │
                    │  5. Colar DATABASE_URL       │
                    │  6. Adicionar JWT_SECRET    │
                    │  7. Clicar "Deploy"          │
                    └──────────┬──────────────────┘
                               │
                    ┌──────────▼──────────────────┐
                    │  8. Aguardar build (3-5min) │
                    │  9. Testar health check      │
                    └──────────┬──────────────────┘
                               │
                    ┌──────────▼──────────────────┐
                    │  10. PRONTO! 🎉             │
                    │  Sua API na nuvem!          │
                    └─────────────────────────────┘
```

> **📖 Tutorial completo**: Abra o arquivo `DEPLOY_GUIDE.md` para o passo a passo com prints!

---

## 🧠 Glossário para Iniciantes

| Termo | Tradução | Significado |
|-------|----------|-------------|
| **Container** | Recipiente | Ambiente isolado rodando seu código |
| **Imagem** | Foto/Molde | Modelo congelado para criar containers |
| **Dockerfile** | Receita | Instruções para construir a imagem |
| **Build** | Construir | Processo de criar a imagem |
| **Port mapping** | `3000:3000` | Liga a porta do PC à porta do container |
| **Volume** | Disco virtual | Dados que persistem fora do container |
| **Healthcheck** | Check-up | Teste que verifica se o serviço está saudável |
| **Migration** | Migração | Script que cria/atualiza tabelas do banco |
| **Deploy** | Implantar | Colocar a aplicação no ar |

---

> **💡 Dica Final**: Docker é como uma "máquina virtual super leve" só para sua aplicação. O Render é tipo um "data center" onde você aluga espaço para rodar esses containers. Juntos, eles garantem que seu código funcione igual em qualquer lugar! 🚀