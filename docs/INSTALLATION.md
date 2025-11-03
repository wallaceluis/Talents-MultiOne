# 📦 Guia de Instalação - Talents MultiOne

## Índice
- [Requisitos do Sistema](#requisitos-do-sistema)
- [Instalação Passo a Passo](#instalação-passo-a-passo)
- [Configuração do Banco](#configuração-do-banco)
- [Seed Inicial](#seed-inicial)
- [Verificação](#verificação)

---

## Requisitos do Sistema

### Software Necessário

| Software | Versão Mínima | Recomendada | Download |
|----------|---------------|-------------|----------|
| Node.js | 18.0.0 | 20.x | [nodejs.org](https://nodejs.org/) |
| npm | 9.0.0 | 10.x | (incluído no Node.js) |
| PostgreSQL | 14.0 | 16.x | [postgresql.org](https://www.postgresql.org/) |
| Git | 2.0 | Latest | [git-scm.com](https://git-scm.com/) |

### Hardware Recomendado

- **CPU**: 2+ cores
- **RAM**: 4GB mínimo, 8GB recomendado
- **Disco**: 10GB livre
- **Rede**: Conexão estável

---

## Instalação Passo a Passo

### 1. Clone o Repositório
```bash
git clone <URL_DO_REPOSITORIO>
cd Talents-MultiOne-Clone
```

### 2. Instale as Dependências do Backend
```bash
cd backend
npm install
```

**Tempo estimado:** 2-3 minutos

### 3. (Opcional) Instale o Frontend
```bash
cd ../frontend
npm install
```

---

## Configuração do Banco

### 1. Criar o Banco de Dados

**Opção A - Via psql:**
```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco
CREATE DATABASE talents;

# Criar usuário
CREATE USER dev WITH PASSWORD 'dev123';

# Dar permissões
GRANT ALL PRIVILEGES ON DATABASE talents TO dev;

# Sair
\q
```

**Opção B - Via comando:**
```bash
createdb -U postgres talents
```

### 2. Configurar Variáveis de Ambiente
```bash
cd backend

# Copiar arquivo de exemplo
cp .env.example .env

# Editar arquivo
nano .env
```

**Configuração do .env:**
```env
# Database
DATABASE_URL="postgresql://dev:dev123@localhost:5432/talents?schema=public"

# JWT
JWT_SECRET="seu-secret-super-seguro-minimo-32-caracteres-aleat0ri0s"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development
```

⚠️ **IMPORTANTE**: Mude o `JWT_SECRET` em produção!

### 3. Executar Migrations
```bash
cd backend
npx prisma migrate dev
```

**O que acontece:**
- Cria todas as tabelas no banco
- Aplica relacionamentos
- Cria índices

**Tabelas criadas:**
- companies
- users
- candidates
- plans
- vacancies
- experiences
- educations
- skills
- candidate_skills
- applications

---

## Seed Inicial

### Executar o Seed
```bash
cd backend
npx prisma db seed
```

**Dados criados:**

### Planos
- **Free**: 2 usuários, 10 candidatos, 2 vagas
- **Básico**: 5 usuários, 50 candidatos, 10 vagas

### Empresas
- Tech Solutions (Plano Básico)
- Innovation Corp (Plano Free)

### Usuários

| Nome | Email | Senha | Role | Empresa |
|------|-------|-------|------|---------|
| Admin User | admin@multione.digital | Admin@123 | ADMIN | Tech Solutions |
| Master User | master@multione.digital | Admin@123 | MANAGER | Tech Solutions |
| João Silva | joao@techsolutions.com | Senha@123 | RECRUITER | Tech Solutions |
| Maria Santos | maria@innovationcorp.com | Senha@123 | VIEWER | Innovation Corp |

### Candidatos
- Carlos Eduardo (com skills JavaScript e React)
- Ana Paula Silva (com skills Node.js e Python)

---

## Verificação

### 1. Iniciar o Backend
```bash
cd backend
npm run start:dev
```

**Output esperado:**
```
[Nest] Starting Nest application...
[Nest] Nest application successfully started
Application is running on: http://localhost:3001
```

### 2. Testar Health Check
```bash
curl http://localhost:3001/api/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-26T20:00:00.000Z"
}
```

### 3. Testar Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@multione.digital",
    "password": "Admin@123"
  }'
```

**Deve retornar um token JWT!**

### 4. Verificar Banco de Dados
```bash
cd backend
npx prisma studio
```

Abre interface visual em: **http://localhost:5555**

---

## Troubleshooting

### Erro: "Port 3001 already in use"
```bash
# Encontrar processo
lsof -i :3001

# Matar processo
kill -9 <PID>
```

### Erro: "Cannot connect to database"
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Ou no Mac
brew services list

# Testar conexão manual
psql -U dev -d talents -h localhost
```

### Erro: "Prisma Client not generated"
```bash
cd backend
npx prisma generate
```

### Erro: "Migration failed"
```bash
# Resetar banco (CUIDADO: apaga tudo!)
npx prisma migrate reset

# Rodar migrations novamente
npx prisma migrate dev

# Rodar seed
npx prisma db seed
```

---

## Instalação Rápida (Script)
```bash
#!/bin/bash

# Clone
git clone <URL> && cd Talents-MultiOne-Clone

# Backend
cd backend
npm install
cp .env.example .env

# Edite o .env manualmente aqui!
echo "⚠️ CONFIGURE O .env ANTES DE CONTINUAR!"
read -p "Pressione ENTER após configurar..."

# Migrations e Seed
npx prisma migrate dev
npx prisma db seed

# Start
npm run start:dev
```

---

## Próximos Passos

Após a instalação:

1. ✅ [Configuração Avançada](CONFIGURATION.md)
2. ✅ [Documentação da API](API.md)
3. ✅ [Guia de Desenvolvimento](DEVELOPMENT.md)
4. ✅ [Deploy em Produção](DEPLOY.md)

---

## Suporte

Problemas durante a instalação?

- Veja [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Abra uma issue no GitHub
- Consulte a documentação do Prisma: https://www.prisma.io/docs
