# 🎯 Talents MultiOne - Sistema de Recrutamento

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

Sistema completo de gerenciamento de recrutamento e seleção de talentos.

[Funcionalidades](#-funcionalidades) • [Instalação](#-instalação) • [Documentação](#-documentação) • [API](#-api)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [API](#-api)
- [Database](#-database)
- [Deploy](#-deploy)
- [Contribuindo](#-contribuindo)

---

## 🎯 Sobre o Projeto

O **Talents MultiOne** é uma plataforma completa para gerenciamento de processos de recrutamento e seleção, desenvolvida para empresas que buscam otimizar suas contratações.

### Por que usar o Talents MultiOne?

- ✅ **Multi-tenant** - Múltiplas empresas no mesmo sistema
- ✅ **Sistema de Planos** - Free, Basic, Premium
- ✅ **Gestão Completa** - Candidatos, vagas, usuários
- ✅ **API RESTful** - Totalmente documentada
- ✅ **Autenticação JWT** - Segurança robusta
- ✅ **Database Relacional** - PostgreSQL com Prisma

---

## ✨ Funcionalidades

### 👥 Gestão de Candidatos
- Cadastro completo de candidatos
- Histórico de experiências profissionais
- Formação acadêmica
- Skills e competências técnicas
- Status do processo seletivo

### 🏢 Gestão de Empresas
- Multi-tenant (várias empresas)
- Planos de assinatura (Free, Basic, Premium)
- Limites por plano
- Status da empresa (ativa/inativa)

### 💼 Gestão de Vagas
- Criação e gerenciamento de vagas
- Requisitos e descrição detalhada
- Faixa salarial
- Modalidade (remoto, presencial, híbrido)
- Status da vaga

### 👤 Gestão de Usuários
- Sistema de roles (Admin, Manager, Recruiter, Viewer)
- Permissões por função
- Múltiplos usuários por empresa

### 📊 Sistema de Planos
- **Free**: 2 usuários, 10 candidatos, 2 vagas
- **Basic**: 5 usuários, 50 candidatos, 10 vagas
- **Premium**: Ilimitado

### 🔐 Autenticação & Autorização
- Login com JWT
- Refresh tokens
- Role-based access control (RBAC)
- Guards por endpoint

---

## 🛠️ Tecnologias

### Backend
- **[NestJS](https://nestjs.com/)** - Framework Node.js progressivo
- **[Prisma](https://www.prisma.io/)** - ORM type-safe
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[JWT](https://jwt.io/)** - Autenticação
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Hash de senhas
- **[class-validator](https://github.com/typestack/class-validator)** - Validação de dados
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática

### Frontend (Opcional)
- **[Next.js 14](https://nextjs.org/)** - Framework React
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilização

### Database
- **PostgreSQL 14+**
- **Prisma ORM**
- **Migrations automáticas**

---

## 🏗️ Arquitetura
```
┌─────────────────────────────────────────────┐
│           Frontend (Next.js)                │
│         localhost:3000 (Opcional)           │
└────────────────┬────────────────────────────┘
                 │ HTTP/REST
                 ▼
┌─────────────────────────────────────────────┐
│         Backend API (NestJS)                │
│            localhost:3001                   │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Auth    │  │Companies │  │Candidates│ │
│  │ Module   │  │  Module  │  │  Module  │ │
│  └──────────┘  └──────────┘  └──────────┘ │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Users   │  │  Plans   │  │Vacancies │ │
│  │ Module   │  │  Module  │  │  Module  │ │
│  └──────────┘  └──────────┘  └──────────┘ │
│                                             │
│         Prisma ORM + Guards                │
└────────────────┬────────────────────────────┘
                 │ Prisma Client
                 ▼
┌─────────────────────────────────────────────┐
│       PostgreSQL Database                   │
│          localhost:5432                     │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │  Schema: public                      │  │
│  │                                      │  │
│  │  • companies  • users                │  │
│  │  • candidates • plans                │  │
│  │  • vacancies  • skills               │  │
│  │  • experiences • educations          │  │
│  │  • applications                      │  │
│  └─────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 14+ ([Download](https://www.postgresql.org/))
- Git ([Download](https://git-scm.com/))

### 1. Clone o repositório
```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd Talents-MultiOne-Clone
```

### 2. Instale o Backend
```bash
cd backend
npm install
```

### 3. Configure o Banco de Dados
```bash
# Crie o banco PostgreSQL
createdb talents

# Copie o .env
cp .env.example .env

# Edite com suas credenciais
nano .env
```

**Configurar DATABASE_URL:**
```env
DATABASE_URL="postgresql://dev:dev123@localhost:5432/talents?schema=public"
```

### 4. Execute as Migrations
```bash
cd backend
npx prisma migrate dev
```

### 5. Popule o Banco (Seed)
```bash
npx prisma db seed
```

**Credenciais criadas:**
- Admin: `admin@multione.digital` / `Admin@123`
- Manager: `master@multione.digital` / `Admin@123`
- Recruiter: `joao@techsolutions.com` / `Senha@123`
- Viewer: `maria@innovationcorp.com` / `Senha@123`

### 6. Inicie o Backend
```bash
npm run start:dev
```

Backend rodando em: **http://localhost:3001**

---

## ⚙️ Configuração

### Variáveis de Ambiente

**backend/.env:**
```env
# Database
DATABASE_URL="postgresql://dev:dev123@localhost:5432/talents?schema=public"

# JWT
JWT_SECRET="seu-secret-super-seguro-minimo-32-caracteres-aleat0ri0s"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

Veja a [documentação completa de configuração](docs/CONFIGURATION.md).

---

## 🚀 Uso

### Acessar a API

Base URL: `http://localhost:3001`

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@multione.digital",
    "password": "Admin@123"
  }'
```

**Resposta:**
```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "name": "Admin User",
      "email": "admin@multione.digital",
      "role": "ADMIN"
    }
  }
}
```

### Usar o Token
```bash
TOKEN="seu-token-aqui"

curl http://localhost:3001/api/companies \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📡 API

### Endpoints Principais

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/login` | Login | ❌ |
| POST | `/api/auth/register` | Registro | ❌ |
| GET | `/api/auth/me` | Usuário atual | ✅ |
| GET | `/api/companies` | Listar empresas | ✅ |
| GET | `/api/candidates` | Listar candidatos | ✅ |
| GET | `/api/users` | Listar usuários | ✅ |
| GET | `/api/plans` | Listar planos | ✅ |
| GET | `/api/vacancies` | Listar vagas | ✅ |

Veja a [documentação completa da API](docs/API.md).

---

## 🗄️ Database

### Schema Principal
```prisma
model Company {
  id        String   @id @default(uuid())
  name      String
  domain    String   @unique
  status    String
  planId    String
  
  plan       Plan         @relation(fields: [planId], references: [id])
  users      User[]
  candidates Candidate[]
  vacancies  Vacancy[]
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      String
  status    String
  companyId String
  
  company   Company  @relation(fields: [companyId], references: [id])
}

model Candidate {
  id        String   @id @default(uuid())
  name      String
  email     String
  phone     String?
  status    String
  companyId String
  
  company    Company           @relation(fields: [companyId], references: [id])
  skills     CandidateSkill[]
  experiences Experience[]
  educations  Education[]
}
```

Veja o [schema completo](backend/prisma/schema.prisma).

---

## 📁 Estrutura do Projeto
```
Talents-MultiOne-Clone/
├── backend/
│   ├── src/
│   │   ├── auth/              # Autenticação
│   │   ├── companies/         # Gestão de empresas
│   │   ├── candidates/        # Gestão de candidatos
│   │   ├── users/             # Gestão de usuários
│   │   ├── plans/             # Planos de assinatura
│   │   ├── vacancies/         # Gestão de vagas
│   │   ├── experiences/       # Experiências
│   │   ├── educations/        # Formações
│   │   └── common/            # Guards, decorators
│   ├── prisma/
│   │   ├── schema.prisma      # Schema do banco
│   │   ├── seed.ts            # Dados iniciais
│   │   └── migrations/        # Migrations
│   └── package.json
├── frontend/ (opcional)
├── docs/                      # Documentação
└── README.md
```

---

## 🚢 Deploy

### Produção
```bash
# Build
cd backend
npm run build

# Start
npm run start:prod
```

### Docker (em breve)
```bash
docker-compose up -d
```

---

## 🐛 Troubleshooting

Veja o [guia completo de troubleshooting](docs/TROUBLESHOOTING.md).

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: Nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto é de uso interno da MultiOne Digital.

---

## 🔗 Links Relacionados

- [DEV Talents - Painel de Monitoramento](https://github.com/wesleyrobot/DEV-PAINEL-)
- [Documentação Completa](docs/)

---

<div align="center">

**Versão 1.0.0** • **Status: ✅ Produção**

Made with ❤️ for MultiOne Digital

</div>
