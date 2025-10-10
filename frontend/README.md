# Frontend - Talents MultiOne

Este projeto é o **frontend** do sistema Talents MultiOne, construído com **Next.js** e **TypeScript**, estilizado com **Tailwind CSS**.

---

## Tecnologias utilizadas

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- ESLint
- Prettier

---

## Configuração do ambiente

### 1. Instalar Node.js

Baixe e instale a versão recomendada: **Node.js >=18**  
[https://nodejs.org/]

### 2. Clonar o repositório e entrar na pasta frontend

git clone https://github.com/wallaceluis/Talents-MultiOne.git
cd frontend

### 3. Instalar dependências

npm install

### 4. Copiar arquivo de ambiente

cp .env.example .env

Ajuste as variáveis de ambiente no `.env` se necessário (URLs do backend, chaves etc).

### 5. Rodar servidor de desenvolvimento

npm run dev

O frontend estará disponível em: [http://localhost:3000](http://localhost:3000)

### 6. Outros comandos úteis

- **Build para produção:**
npm run build

- **Rodar build localmente:**
npm start

- **Rodar lint:**
npm run lint

---

## Estrutura principal do projeto

frontend/
├─ app/ # Páginas e rotas
├─ components/ # Componentes reutilizáveis
├─ hooks/ # Hooks para consumo de API
├─ lib/ # Funções e utilitários genéricos
├─ styles/ # Arquivos CSS globais
├─ types/ # Tipos TypeScript

---

## Fluxo de trabalho diário (Git)

Antes de começar a trabalhar, siga este fluxo:

### 1. Verificar a branch atual

git branch

### 2. Trocar para a branch dev

git checkout dev

### 3. Puxar as últimas alterações do remoto

git pull origin dev

> Isso garante que você está com a versão mais atualizada do projeto.

### 4. Adicionar alterações locais

git add .

### 5. Criar commit com mensagem descritiva

git commit -m "Descrição do que foi feito"

### 6. Enviar para o remoto na branch dev

git push origin dev

> **Importante:** Nunca faça commits diretos na `main`. Só a equipe de líderes/admin faz merges da `dev` para `main`.