# Backend - Talents MultiOne

Este é o **backend** do sistema Talents MultiOne, uma API robusta desenvolvida com **NestJS**, **Prisma** e **PostgreSQL**.

---

## 🛠️ Tecnologias Utilizadas

- **NestJS** - Framework Node.js progressivo
- **Prisma** - ORM moderno para Node.js e TypeScript
- **PostgreSQL** - Banco de dados relacional
- **JWT (JSON Web Token)** - Autenticação segura
- **Bcrypt** - Hash de senhas
- **Jest** - Testes automatizados (Unitários e E2E)
- **Docker** - Containerização (opcional)

---

## 📋 Pré-requisitos

- **Node.js** 18+
- **PostgreSQL** 14+
- **NPM** ou **Yarn**

---

## 🚀 Instalação e Configuração

### 1. Entrar na pasta do backend

```bash
cd backend
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie o arquivo de exemplo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do banco de dados e configurações JWT:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/talents?schema=public"
JWT_SECRET="sua_chave_secreta"
JWT_EXPIRES_IN="30d"
PORT=3001
```

### 4. Configurar Banco de Dados via Prisma

```bash
# Executar migrações
npx prisma migrate deploy

# Gerar cliente Prisma (opcional se o install já fez)
npx prisma generate

# Popular o banco com dados iniciais (Seed)
npx prisma db seed
```

---

## 🏃‍♂️ Rodando a Aplicação

### Desenvolvimento

```bash
npm run start:dev
```
O servidor estará rodando em: `http://localhost:3001`

### Produção

```bash
npm run build
npm run start:prod
```

### Prisma Studio (Visualizador de Banco de Dados)

```bash
npx prisma studio
```
Acesse em: `http://localhost:5555`

---

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

---

## 📂 Estrutura do Projeto

```
src/
├── auth/           # Módulo de Autenticação (Guards, Strategies)
├── users/          # Gestão de Usuários
├── companies/      # Gestão de Empresas
├── candidates/     # Gestão de Candidatos
├── vacancies/      # Gestão de Vagas
├── common/         # Decorators, Filters, Interceptors globais
├── prisma/         # Configuração e Seed do Prisma
└── main.ts         # Ponto de entrada da aplicação
```
