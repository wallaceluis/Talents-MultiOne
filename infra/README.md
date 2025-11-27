# Talents MultiOne - Infraestrutura

Configuração de infraestrutura para implantar e executar o Talents MultiOne usando Docker.

## 🐳 Docker Compose

O arquivo `docker-compose.yml` orquestra os seguintes serviços:

- **frontend**: Aplicação Next.js
- **backend**: API NestJS
- **db**: Banco de dados PostgreSQL
- **nginx**: Proxy reverso (opcional, se configurado)

## 🚀 Uso

### Iniciar Todos os Serviços
Para iniciar toda a stack em modo "detached" (segundo plano):

```bash
cd infra
docker-compose up -d
```

### Parar Serviços
Para parar todos os serviços em execução:

```bash
docker-compose down
```

### Ver Logs
Para acompanhar os logs de todos os serviços:

```bash
docker-compose logs -f
```

## ⚙️ Configuração

- **Variáveis de Ambiente**: Certifique-se de que os arquivos `.env` estejam configurados corretamente nos diretórios `frontend` e `backend`, ou passe-os via `docker-compose.yml`.
- **Portas**:
  - Frontend: 3000
  - Backend: 3001
  - Banco de Dados: 5432

## 📁 Arquivos

- `docker-compose.yml`: Arquivo principal de composição.
- `Dockerfile.frontend`: Instruções de build Docker para o frontend.
- `Dockerfile.backend`: Instruções de build Docker para o backend.
- `nginx.conf`: Configuração do Nginx para roteamento (se aplicável).
