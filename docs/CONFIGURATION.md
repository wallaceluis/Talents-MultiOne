# ⚙️ Guia de Configuração - Talents MultiOne

## Índice
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Configuração do Banco](#configuração-do-banco)
- [Configuração JWT](#configuração-jwt)
- [CORS](#cors)
- [Planos e Limites](#planos-e-limites)
- [Roles e Permissões](#roles-e-permissões)

---

## Variáveis de Ambiente

### Backend (.env)

Localização: `backend/.env`
```env
# ============================================
# DATABASE
# ============================================
DATABASE_URL="postgresql://dev:dev123@localhost:5432/talents?schema=public"

# ============================================
# JWT
# ============================================
JWT_SECRET="seu-secret-super-seguro-minimo-32-caracteres-aleat0ri0s"
JWT_EXPIRES_IN="7d"

# ============================================
# SERVER
# ============================================
PORT=3001
NODE_ENV=development

# ============================================
# CORS
# ============================================
CORS_ORIGIN=http://localhost:3000
```

### Descrição das Variáveis

| Variável | Tipo | Obrigatória | Descrição |
|----------|------|-------------|-----------|
| `DATABASE_URL` | string | ✅ | URL de conexão PostgreSQL |
| `JWT_SECRET` | string | ✅ | Chave secreta para JWT (mín. 32 chars) |
| `JWT_EXPIRES_IN` | string | ❌ | Tempo de expiração do token (default: 7d) |
| `PORT` | number | ❌ | Porta do servidor (default: 3001) |
| `NODE_ENV` | string | ❌ | Ambiente (development/production) |
| `CORS_ORIGIN` | string | ❌ | Origem permitida para CORS |

---

## Configuração do Banco

### Connection String

Formato:
```
postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]?schema=public
```

**Exemplo:**
```
postgresql://dev:dev123@localhost:5432/talents?schema=public
```

### Componentes

| Componente | Exemplo | Descrição |
|------------|---------|-----------|
| USER | dev | Usuário do PostgreSQL |
| PASSWORD | dev123 | Senha do usuário |
| HOST | localhost | Endereço do servidor |
| PORT | 5432 | Porta do PostgreSQL |
| DATABASE | talents | Nome do banco |
| schema | public | Schema do PostgreSQL |

### SSL (Produção)

Para produção com SSL:
```env
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public&sslmode=require"
```

---

## Configuração JWT

### Gerar Secret Seguro
```bash
# Opção 1: OpenSSL
openssl rand -base64 32

# Opção 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Opção 3: Online
# https://generate-secret.vercel.app/32
```

### Tempo de Expiração

Valores aceitos:
- `60s` - 60 segundos
- `15m` - 15 minutos
- `1h` - 1 hora
- `7d` - 7 dias
- `30d` - 30 dias

**Recomendado:**
- Desenvolvimento: `7d`
- Produção: `1h` com refresh token

---

## CORS

### Desenvolvimento
```env
CORS_ORIGIN=http://localhost:3000
```

### Múltiplas Origens
```typescript
// src/main.ts
app.enableCors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://talents.seu-dominio.com'
  ],
  credentials: true
});
```

### Produção
```env
CORS_ORIGIN=https://talents.seu-dominio.com
```

---

## Planos e Limites

### Planos Disponíveis
```typescript
enum PlanType {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM'
}
```

### Limites por Plano

| Plano | Usuários | Candidatos | Vagas | Preço |
|-------|----------|------------|-------|-------|
| FREE | 2 | 10 | 2 | R$ 0 |
| BASIC | 5 | 50 | 10 | R$ 99,90 |
| PREMIUM | Ilimitado | Ilimitado | Ilimitado | R$ 299,90 |

### Customizar Limites

Edite o seed:
```typescript
// backend/prisma/seed.ts
const planFree = await prisma.plan.create({
  data: {
    name: 'Free',
    type: 'FREE',
    maxUsers: 2,        // ← Altere aqui
    maxCandidates: 10,  // ← Altere aqui
    maxVacancies: 2,    // ← Altere aqui
    price: 0,
    features: ['2 usuários', '10 candidatos', '2 vagas'],
    isActive: true,
  },
});
```

---

## Roles e Permissões

### Roles Disponíveis
```typescript
enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  RECRUITER = 'RECRUITER',
  VIEWER = 'VIEWER'
}
```

### Permissões por Role

| Funcionalidade | ADMIN | MANAGER | RECRUITER | VIEWER |
|----------------|-------|---------|-----------|--------|
| Ver empresas | ✅ | ✅ | ✅ | ✅ |
| Editar empresa | ✅ | ✅ | ❌ | ❌ |
| Ver candidatos | ✅ | ✅ | ✅ | ✅ |
| Criar candidatos | ✅ | ✅ | ✅ | ❌ |
| Editar candidatos | ✅ | ✅ | ✅ | ❌ |
| Deletar candidatos | ✅ | ✅ | ❌ | ❌ |
| Ver vagas | ✅ | ✅ | ✅ | ✅ |
| Criar vagas | ✅ | ✅ | ✅ | ❌ |
| Ver usuários | ✅ | ✅ | ❌ | ❌ |
| Criar usuários | ✅ | ✅ | ❌ | ❌ |
| Ver planos | ✅ | ✅ | ❌ | ❌ |

### Implementar Guard Customizado
```typescript
// src/common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}
```

**Uso:**
```typescript
@Roles('ADMIN', 'MANAGER')
@UseGuards(JwtAuthGuard, RolesGuard)
@Delete(':id')
deleteCompany(@Param('id') id: string) {
  return this.companiesService.remove(id);
}
```

---

## Configuração Avançada

### Logging
```typescript
// src/main.ts
app.useLogger(['error', 'warn', 'log', 'debug', 'verbose']);
```

### Rate Limiting
```bash
npm install @nestjs/throttler
```
```typescript
// app.module.ts
ThrottlerModule.forRoot({
  ttl: 60,
  limit: 10,
})
```

### Validação Global
```typescript
// main.ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

---

## Ambientes

### Development
```env
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://dev:dev123@localhost:5432/talents"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN=http://localhost:3000
```

### Production
```env
NODE_ENV=production
PORT=3001
DATABASE_URL="postgresql://user:pass@prod-host:5432/talents?sslmode=require"
JWT_SECRET="[GENERATED_SECURE_SECRET_32_CHARS]"
JWT_EXPIRES_IN="1h"
CORS_ORIGIN=https://talents.seu-dominio.com
```

---

## Checklist de Configuração

Antes de deploy:

- [ ] `JWT_SECRET` gerado com segurança
- [ ] `DATABASE_URL` configurado corretamente
- [ ] SSL habilitado no banco (produção)
- [ ] `NODE_ENV=production`
- [ ] `CORS_ORIGIN` configurado
- [ ] Senhas padrão alteradas
- [ ] Rate limiting habilitado
- [ ] Logs configurados

---

## Próximos Passos

- ✅ [Documentação da API](API.md)
- ✅ [Guia de Deploy](DEPLOY.md)
- ✅ [Troubleshooting](TROUBLESHOOTING.md)
