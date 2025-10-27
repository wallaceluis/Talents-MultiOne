# 🚀 Talents MultiOne

Sistema completo de gerenciamento de recrutamento e seleção com **Next.js 15**, **NestJS**, **Prisma** e **PostgreSQL**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-18.x-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black.svg)

---

## 📖 Sobre o Projeto

**Talents MultiOne** é uma plataforma completa para gestão de processos de recrutamento e seleção.

### ✨ Funcionalidades

- 🔐 **Autenticação JWT** - Login/Logout seguro
- 🏢 **CRUD de Empresas** - Gestão completa
- 💼 **Gestão de Vagas** - Controle de processos
- 👥 **Gestão de Candidatos** - Base de talentos
- 📊 **Dashboard** - Métricas e estatísticas
- 🎨 **Tema Claro/Escuro** - Interface moderna

---

## 🛠 Tecnologias

### Frontend
- Next.js 15 + TypeScript
- Tailwind CSS
- Axios

### Backend
- NestJS
- Prisma ORM
- PostgreSQL
- JWT

---

## ⚙️ Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

---

## 📥 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/wallaceluis/Talents-MultiOne.git
cd Talents-MultiOne
```

### 2. Configure o PostgreSQL
```bash
# Iniciar PostgreSQL
sudo service postgresql start

# Criar banco de dados
sudo -u postgres psql
CREATE DATABASE talents;
CREATE USER dev WITH PASSWORD 'dev123';
GRANT ALL PRIVILEGES ON DATABASE talents TO dev;
\q
```

### 3. Configure o Backend
```bash
cd backend
npm install

# Criar arquivo .env
cat > .env << 'ENV'
DATABASE_URL="postgresql://dev:dev123@localhost:5432/talents?schema=public"
JWT_SECRET="seu-secret-super-seguro-aqui-2024"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
ENV

# Executar migrações
npx prisma migrate deploy
npx prisma db seed
```

### 4. Configure o Frontend
```bash
cd ../frontend
npm install

# Criar arquivo .env.local
cat > .env.local << 'ENV'
NEXT_PUBLIC_API_URL=http://localhost:3001/api
ENV
```

---

## 🚀 Executando o Projeto

### Terminal 1 - Backend:
```bash
cd backend
npm run start:dev
```
✅ Backend: http://localhost:3001

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```
✅ Frontend: http://localhost:3000

---

## 🔑 Credenciais Padrão

Após executar o seed:

- **Email:** admin@multione.digital
- **Senha:** Admin@123

---

## 🔌 API Endpoints

### Autenticação
```
POST   /api/auth/login      # Login
GET    /api/auth/me         # Usuário atual
```

### Empresas
```
GET    /api/companies       # Listar
GET    /api/companies/:id   # Buscar
POST   /api/companies       # Criar
PATCH  /api/companies/:id   # Atualizar
DELETE /api/companies/:id   # Deletar
```

---

## 📁 Estrutura
```
Talents-MultiOne/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── companies/
│   │   └── users/
│   └── prisma/
│       └── schema.prisma
├── frontend/
│   ├── app/
│   │   ├── auth/
│   │   ├── companies/
│   │   └── dashboard/
│   ├── hooks/
│   └── types/
└── README.md
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/MinhaFeature`)
3. Commit (`git commit -m 'Add: MinhaFeature'`)
4. Push (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT.

---

## 👥 Autor

**Wallace Luis** - [GitHub](https://github.com/wallaceluis)

---

**Desenvolvido com ❤️ por MultiOne Digital**

---

## 💻 Desenvolvendo no VS Code

### 🎨 Configuração Recomendada

#### 1. Abrir o projeto
```bash
cd ~/Talents-MultiOne-Clone
code .
```

#### 2. Instalar extensões recomendadas

- **ESLint** - Linter JavaScript/TypeScript
- **Prettier** - Formatação de código
- **Prisma** - Syntax highlighting para schema
- **GitLens** - Git supercharged
- **Thunder Client** - Testar API (alternativa ao Postman)

#### 3. Configurar terminais integrados

O VS Code permite múltiplos terminais na mesma janela:

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```
✅ Backend rodando em: http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend rodando em: http://localhost:3000

**Atalhos úteis:**
- `` Ctrl+` `` - Abrir/fechar terminal
- `Ctrl+Shift+5` - Dividir terminal
- `Ctrl+Shift+]` - Próximo terminal

---

### 🔧 Git no VS Code

O VS Code tem integração visual com Git:

#### **Source Control (Ctrl+Shift+G)**

1. **Ver mudanças:** Arquivos modificados aparecem automaticamente
2. **Stage (adicionar):** Clique no `+` ao lado do arquivo
3. **Commit:** Digite a mensagem e clique em ✓
4. **Push:** Menu `...` → `Push` ou `Sync Changes`

#### **Ver branch atual:**
- Canto inferior esquerdo da janela
- Clique para trocar de branch

#### **Comparar mudanças:**
- Clique em qualquer arquivo modificado
- Veja lado a lado: antes → depois

---

### 📂 Layout recomendado
```
┌──────────────────────────────────────────────────┐
│  🔍 Explorer        │  📝 Editor (código)        │
│  ├── backend/       │                            │
│  ├── frontend/      │  Edite seus arquivos aqui  │
│  └── README.md      │                            │
├──────────────────────────────────────────────────┤
│  🖥️ Terminal 1     │  🖥️ Terminal 2             │
│  Backend running   │  Frontend running          │
│  Port 3001         │  Port 3000                 │
└──────────────────────────────────────────────────┘
```

---

### ⚡ Dicas de Produtividade

1. **Ctrl+P** - Buscar arquivo rapidamente
2. **Ctrl+Shift+F** - Buscar em todos os arquivos
3. **Ctrl+D** - Selecionar próxima ocorrência
4. **Alt+Shift+F** - Formatar documento
5. **F12** - Ir para definição
6. **Ctrl+Space** - Autocomplete

---

### 🐛 Debugging

#### Frontend (Next.js):
1. Adicione breakpoints clicando na margem esquerda
2. Pressione `F5` ou vá em `Run and Debug`
3. Selecione "Next.js: debug full stack"

#### Backend (NestJS):
1. Configure `launch.json`:
```json
{
  "type": "node",
  "request": "attach",
  "name": "Attach to NestJS",
  "port": 9229,
  "restart": true
}
```
2. Execute backend com: `npm run start:debug`
3. Pressione `F5`

---

### 📦 Extensões Adicionais Úteis

- **Auto Rename Tag** - Renomeia tags HTML automaticamente
- **Path Intellisense** - Autocomplete de caminhos
- **Color Highlight** - Preview de cores no código
- **Error Lens** - Mostra erros inline
- **Import Cost** - Mostra tamanho dos imports

---

