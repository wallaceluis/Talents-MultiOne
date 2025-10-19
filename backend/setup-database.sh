#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}   CONFIGURAÇÃO DO BANCO DE DADOS${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

# 1. Iniciar PostgreSQL
echo -e "${YELLOW}[1/4] Iniciando PostgreSQL...${NC}"
sudo service postgresql start
echo -e "${GREEN}✅ PostgreSQL iniciado!${NC}"
echo ""

# 2. Criar banco e usuário
echo -e "${YELLOW}[2/4] Criando banco de dados...${NC}"
sudo -u postgres psql << 'SQLCOMMANDS'
-- Criar usuário se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'dev') THEN
    CREATE USER dev WITH PASSWORD 'dev123';
  END IF;
END $$;

-- Criar banco se não existir
SELECT 'CREATE DATABASE talents'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'talents')\gexec

-- Dar permissões
GRANT ALL PRIVILEGES ON DATABASE talents TO dev;
ALTER DATABASE talents OWNER TO dev;
SQLCOMMANDS
echo -e "${GREEN}✅ Banco de dados configurado!${NC}"
echo ""

# 3. Executar migrations
echo -e "${YELLOW}[3/4] Executando migrations...${NC}"
npx prisma migrate dev --name setup_complete
echo -e "${GREEN}✅ Migrations aplicadas!${NC}"
echo ""

# 4. Executar seeds
echo -e "${YELLOW}[4/4] Executando seeds...${NC}"
npx prisma db seed
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   ✅ TUDO CONFIGURADO!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

echo -e "${YELLOW}🔑 Credenciais do banco:${NC}"
echo -e "   Host: localhost:5432"
echo -e "   Database: talents"
echo -e "   User: dev / Password: dev123"
echo ""

echo -e "${YELLOW}🔑 Credenciais de login (DESENVOLVIMENTO):${NC}"
echo -e "   Admin: admin@multione.digital / Admin@123"
echo -e "   Master: master@multione.digital / Admin@123"
echo -e "   Recruiter: joao@techsolutions.com / Senha@123"
echo -e "   Viewer: maria@innovationcorp.com / Senha@123"
echo ""

echo -e "${YELLOW}🚀 Iniciar servidor:${NC}"
echo -e "   ${GREEN}npm run start:dev${NC}"
echo ""
