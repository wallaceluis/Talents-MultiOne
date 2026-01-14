# 🎯 Talents-MultiOne - Sistema de Recrutamento

Sistema completo de recrutamento e gestão de candidatos desenvolvido com NestJS e Next.js.

## � Autores

- **Wallace Luis** - [@wallaceluis](https://github.com/wallaceluis)
- **Felipe Fernandes** - [@Felipe-Fernandes97](https://github.com/Felipe-Fernandes97)
- **Wesley Costa** - [@wesleyrobot](https://github.com/wesleyrobot)

## �📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

## 🚀 Instalação e Configuração

### 1️⃣ Clonar o Repositório
```bash
git clone https://github.com/wallaceluis/Talents-MultiOne.git
cd Talents-MultiOne
```

### 2️⃣ Configurar o Backend
```bash
cd backend

# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env
```

**Editar o arquivo `.env`** com suas configurações:
```env
# Database
DATABASE_URL="postgresql://dev:dev123@localhost:5432/talents?schema=public"

# JWT
JWT_SECRET="sua-chave-secreta-super-segura-aqui"
JWT_EXPIRES_IN=30d

# Server
PORT=3001
```

### 3️⃣ Configurar o Banco de Dados
```bash
# Criar o banco de dados PostgreSQL
psql -U postgres -c "CREATE DATABASE talents;"
psql -U postgres -c "CREATE USER dev WITH PASSWORD 'dev123';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE talents TO dev;"

# Executar migrations
npx prisma migrate deploy

# Popular banco com dados iniciais (seed)
npx prisma db seed
```

### 4️⃣ Iniciar o Backend
```bash
npm run start:dev
```

✅ Backend rodando em: **http://localhost:3001**

---

### 5️⃣ Configurar o Frontend

**Em outro terminal:**
```bash
cd frontend

# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env.local
```

**Editar o arquivo `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 6️⃣ Iniciar o Frontend
```bash
npm run dev
```

✅ Frontend rodando em: **http://localhost:3000**

---

## 👤 Credenciais de Acesso Padrão

Após executar o seed, você pode fazer login com:

### Admin Principal
- **Email:** `admin@multione.digital`
- **Senha:** `Admin@123`

### Master User
- **Email:** `master@multione.digital`
- **Senha:** `Admin@123`

### Recruiter
- **Email:** `joao@techsolutions.com`
- **Senha:** `Senha@123`

---

## 📂 Estrutura do Projeto
```
Talents-MultiOne/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── auth/           # Autenticação JWT
│   │   ├── users/          # Gerenciamento de usuários
│   │   ├── companies/      # Gerenciamento de empresas
│   │   ├── candidates/     # Gerenciamento de candidatos
│   │   ├── vacancies/      # Gerenciamento de vagas
│   │   └── ...
│   ├── prisma/
│   │   ├── schema.prisma   # Schema do banco
│   │   └── seed.ts         # Dados iniciais
│   └── package.json
│
└── frontend/               # App Next.js
    ├── app/                # App Router (Next.js 14)
    ├── components/         # Componentes React
    ├── hooks/              # Custom Hooks
    ├── lib/                # Utilitários
    └── package.json
```

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **NestJS** - Framework Node.js
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Criptografia de senhas

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Axios** - Cliente HTTP

---

## 🔧 Scripts Úteis

### Backend
```bash
npm run start:dev          # Modo desenvolvimento
npm run build              # Build para produção
npm run start:prod         # Iniciar produção
npx prisma studio          # Interface visual do banco
npx prisma migrate reset   # Resetar banco (cuidado!)
```

### Frontend
```bash
npm run dev                # Modo desenvolvimento
npm run build              # Build para produção
npm run start              # Iniciar produção
npm run lint               # Verificar código
```

---

## 🐛 Solução de Problemas Comuns

### Erro: "Cannot connect to database"
```bash
# Verificar se PostgreSQL está rodando
sudo service postgresql status

# Iniciar PostgreSQL
sudo service postgresql start
```

### Erro: "Port 3001 already in use"
```bash
# Matar processo na porta 3001
lsof -ti:3001 | xargs kill -9
```

### Erro: "Token expired" no navegador
```bash
# Limpar localStorage do navegador
# F12 → Application → Local Storage → Clear
# Fazer login novamente
```

---

## 📝 Funcionalidades

✅ Autenticação JWT (token de 30 dias)  
✅ Gerenciamento de Usuários (CRUD completo)  
✅ Gerenciamento de Empresas  
✅ Gerenciamento de Candidatos  
✅ Gerenciamento de Vagas  
✅ Sistema de Permissões (ADMIN, MANAGER, RECRUITER, VIEWER)  
✅ Multi-tenancy (por empresa)  
✅ Dashboard com estatísticas  

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT.

---



---

## 📞 Suporte

Se tiver problemas ou dúvidas:
1. Abra uma [Issue](https://github.com/wallaceluis/Talents-MultiOne/issues)
2. Entre em contato via GitHub

---

⭐ **Se este projeto te ajudou, deixe uma estrela!** ⭐
