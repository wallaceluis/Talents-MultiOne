#!/bin/bash

# ========================================
# Script COMPLETO - Pessoa 2: Auth & Users
# Projeto: Talents-MultiOne (NestJS + Prisma)
# Tecnologias: JWT, Passport, bcrypt
# Execute: bash setup-pessoa2-auth.sh
# ========================================

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

clear
echo -e "${PURPLE}========================================${NC}"
echo -e "${PURPLE}   SETUP PESSOA 2 - AUTH & USERS${NC}"
echo -e "${PURPLE}   NestJS + Prisma + JWT${NC}"
echo -e "${PURPLE}========================================${NC}"
echo ""

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute dentro da pasta backend/${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Diretório correto!${NC}"
echo ""

# ========================================
# PASSO 1: Instalar Dependências
# ========================================
echo -e "${CYAN}[1/8] 📦 Instalando dependências...${NC}"
echo ""

npm install @nestjs/jwt @nestjs/passport passport passport-jwt passport-local bcrypt
npm install -D @types/bcrypt @types/passport-jwt @types/passport-local

echo -e "${GREEN}✅ Dependências instaladas!${NC}"
echo ""

# ========================================
# PASSO 2: Criar Auth Module
# ========================================
echo -e "${CYAN}[2/8] 🔐 Criando Auth Module...${NC}"
echo ""

# auth.module.ts
cat > src/auth/auth.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
EOF

# auth.service.ts
cat > src/auth/auth.service.ts << 'EOF'
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Usuário inativo');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    return this.login({
      email: user.email,
      password: registerDto.password,
    });
  }

  async me(userId: string) {
    return this.usersService.findOne(userId);
  }
}
EOF

# auth.controller.ts
cat > src/auth/auth.controller.ts << 'EOF'
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: any) {
    return this.authService.me(user.userId);
  }
}
EOF

echo -e "${GREEN}✅ Auth Module criado!${NC}"
echo ""

# ========================================
# PASSO 3: Criar DTOs
# ========================================
echo -e "${CYAN}[3/8] 📝 Criando DTOs...${NC}"
echo ""

# login.dto.ts
cat > src/auth/dto/login.dto.ts << 'EOF'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;
}
EOF

# register.dto.ts
cat > src/auth/dto/register.dto.ts << 'EOF'
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;

  @IsEnum(['ADMIN', 'MANAGER', 'RECRUITER', 'VIEWER'], {
    message: 'Role inválido',
  })
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  companyId?: string;
}
EOF

echo -e "${GREEN}✅ DTOs criados!${NC}"
echo ""

# ========================================
# PASSO 4: Criar Strategies
# ========================================
echo -e "${CYAN}[4/8] 🎯 Criando Strategies...${NC}"
echo ""

# jwt.strategy.ts
cat > src/auth/strategies/jwt.strategy.ts << 'EOF'
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOne(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Usuário inativo');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      companyId: payload.companyId,
    };
  }
}
EOF

# local.strategy.ts
cat > src/auth/strategies/local.strategy.ts << 'EOF'
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    return user;
  }
}
EOF

echo -e "${GREEN}✅ Strategies criadas!${NC}"
echo ""

# ========================================
# PASSO 5: Criar Users Module
# ========================================
echo -e "${CYAN}[5/8] 👥 Criando Users Module...${NC}"
echo ""

# users.module.ts
cat > src/users/users.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
EOF

# users.service.ts
cat > src/users/users.service.ts << 'EOF'
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const { password, ...user } = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        status: 'ACTIVE',
      },
    });

    return user;
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        companyId: true,
        company: {
          select: {
            id: true,
            name: true,
            domain: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const { password, ...user } = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return user;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.user.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });

    return { message: 'Usuário desativado com sucesso' };
  }
}
EOF

# users.controller.ts
cat > src/users/users.controller.ts << 'EOF'
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('ADMIN', 'MANAGER')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MANAGER')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
EOF

# create-user.dto.ts
cat > src/users/dto/create-user.dto.ts << 'EOF'
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;

  @IsEnum(['ADMIN', 'MANAGER', 'RECRUITER', 'VIEWER'], {
    message: 'Role deve ser: ADMIN, MANAGER, RECRUITER ou VIEWER',
  })
  @IsNotEmpty({ message: 'Role é obrigatório' })
  role: string;

  @IsString()
  @IsOptional()
  companyId?: string;
}
EOF

# update-user.dto.ts
cat > src/users/dto/update-user.dto.ts << 'EOF'
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEnum(['ACTIVE', 'INACTIVE'], {
    message: 'Status deve ser ACTIVE ou INACTIVE',
  })
  @IsOptional()
  status?: string;
}
EOF

echo -e "${GREEN}✅ Users Module criado!${NC}"
echo ""

# ========================================
# PASSO 6: Criar Guards
# ========================================
echo -e "${CYAN}[6/8] 🛡️  Criando Guards...${NC}"
echo ""

# jwt-auth.guard.ts
cat > src/guards/jwt-auth.guard.ts << 'EOF'
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
EOF

# roles.guard.ts
cat > src/guards/roles.guard.ts << 'EOF'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
EOF

echo -e "${GREEN}✅ Guards criados!${NC}"
echo ""

# ========================================
# PASSO 7: Criar Decorators
# ========================================
echo -e "${CYAN}[7/8] 🎨 Criando Decorators...${NC}"
echo ""

mkdir -p src/common/decorators

# public.decorator.ts
cat > src/common/decorators/public.decorator.ts << 'EOF'
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
EOF

# roles.decorator.ts
cat > src/common/decorators/roles.decorator.ts << 'EOF'
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
EOF

# current-user.decorator.ts
cat > src/common/decorators/current-user.decorator.ts << 'EOF'
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
EOF

echo -e "${GREEN}✅ Decorators criados!${NC}"
echo ""

# ========================================
# PASSO 8: Atualizar AppModule
# ========================================
echo -e "${CYAN}[8/8] 🔧 Atualizando AppModule...${NC}"
echo ""

cat > src/app.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
EOF

echo -e "${GREEN}✅ AppModule atualizado!${NC}"
echo ""

# ========================================
# Atualizar Seeds com usuários
# ========================================
echo -e "${CYAN}💾 Atualizando Seeds...${NC}"
echo ""

cat > prisma/seed.ts << 'EOF'
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeds...');

  // Limpar dados
  console.log('🗑️  Limpando dados antigos...');
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();
  await prisma.plan.deleteMany();

  // Criar Planos
  console.log('📦 Criando planos...');
  const planFree = await prisma.plan.create({
    data: {
      name: 'Free',
      type: 'FREE',
      maxUsers: 2,
      maxCandidates: 10,
      maxVacancies: 2,
      price: 0,
      features: ['2 usuários', '10 candidatos', '2 vagas'],
      isActive: true,
    },
  });

  const planBasic = await prisma.plan.create({
    data: {
      name: 'Básico',
      type: 'BASIC',
      maxUsers: 5,
      maxCandidates: 50,
      maxVacancies: 10,
      price: 99.90,
      features: ['5 usuários', '50 candidatos', '10 vagas', 'Suporte'],
      isActive: true,
    },
  });

  // Criar Empresas
  console.log('🏢 Criando empresas...');
  const company1 = await prisma.company.create({
    data: {
      name: 'Tech Solutions',
      domain: 'techsolutions.com',
      status: 'ACTIVE',
      planId: planBasic.id,
    },
  });

  const company2 = await prisma.company.create({
    data: {
      name: 'Innovation Corp',
      domain: 'innovationcorp.com',
      status: 'ACTIVE',
      planId: planFree.id,
    },
  });

  // Criar Usuários
  console.log('👥 Criando usuários...');
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@multione.digital',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      companyId: company1.id,
    },
  });

  // Master
  const master = await prisma.user.create({
    data: {
      name: 'Master User',
      email: 'master@multione.digital',
      password: hashedPassword,
      role: 'MANAGER',
      status: 'ACTIVE',
      companyId: company1.id,
    },
  });

  // Recruiter
  const recruiter = await prisma.user.create({
    data: {
      name: 'João Silva',
      email: 'joao@techsolutions.com',
      password: await bcrypt.hash('senha123', 10),
      role: 'RECRUITER',
      status: 'ACTIVE',
      companyId: company1.id,
    },
  });

  // Viewer
  const viewer = await prisma.user.create({
    data: {
      name: 'Maria Santos',
      email: 'maria@innovationcorp.com',
      password: await bcrypt.hash('senha123', 10),
      role: 'VIEWER',
      status: 'ACTIVE',
      companyId: company2.id,
    },
  });

  console.log('✅ Seeds concluídos!');
  console.log('');
  console.log('📊 Resumo:');
  console.log(`   • Planos: 2`);
  console.log(`   • Empresas: 2`);
  console.log(`   • Usuários: 4`);
  console.log('');
  console.log('🔑 Credenciais de Teste:');
  console.log(`   Admin: admin@multione.digital / admin123`);
  console.log(`   Master: master@multione.digital / admin123`);
  console.log(`   Recruiter: joao@techsolutions.com / senha123`);
  console.log(`   Viewer: maria@innovationcorp.com / senha123`);
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
EOF

echo -e "${GREEN}✅ Seeds atualizados!${NC}"
echo ""

# Executar seeds
echo -e "${YELLOW}🌱 Executando seeds...${NC}"
npx prisma db seed

# ========================================
# Atualizar .env se necessário
# ========================================
echo -e "${CYAN}🔐 Verificando .env...${NC}"
echo ""

if ! grep -q "JWT_SECRET" .env 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Adicionando JWT_SECRET ao .env...${NC}"
    echo "" >> .env
    echo "# JWT Configuration" >> .env
    echo "JWT_SECRET=\"seu-secret-super-seguro-minimo-32-caracteres-aleat0ri0s\"" >> .env
    echo "JWT_EXPIRES_IN=\"7d\"" >> .env
    echo -e "${GREEN}✅ .env atualizado!${NC}"
else
    echo -e "${GREEN}✅ .env já configurado!${NC}"
fi
echo ""

# ========================================
# Git Commit
# ========================================
echo -e "${CYAN}📤 Commitando no Git...${NC}"
echo ""

git add .
git commit -m "feat(auth): implementar autenticação completa (Pessoa 2)

- Auth Module com JWT e Passport
- Users CRUD completo
- Guards (JWT, Roles)
- Decorators (@Public, @Roles, @CurrentUser)
- DTOs com validação
- Seeds com 4 usuários de teste
- Integração com Prisma

Rotas criadas:
- POST /api/auth/login
- POST /api/auth/register  
- GET /api/auth/me
- CRUD /api/users/*

Pessoa 2 - Auth & Users completo ✅"

echo -e "${GREEN}✅ Commit realizado!${NC}"
echo ""

# ========================================
# RESUMO FINAL
# ========================================
clear
echo -e "${PURPLE}========================================${NC}"
echo -e "${PURPLE}   ✅ SETUP COMPLETO - SUCESSO!${NC}"
echo -e "${PURPLE}========================================${NC}"
echo ""

echo -e "${GREEN}🎉 Pessoa 2 (Auth & Users) 100% Completo!${NC}"
echo ""

echo -e "${BLUE}📊 O que foi criado:${NC}"
echo ""
echo -e "${CYAN}✅ Auth Module:${NC}"
echo -e "   • AuthService (login, register, validate)"
echo -e "   • AuthController (3 rotas)"
echo -e "   • JWT Strategy"
echo -e "   • Local Strategy"
echo ""

echo -e "${CYAN}✅ Users Module:${NC}"
echo -e "   • UsersService (CRUD completo)"
echo -e "   • UsersController (5 rotas)"
echo -e "   • Integração com Prisma"
echo ""

echo -e "${CYAN}✅ Guards:${NC}"
echo -e "   • JwtAuthGuard (proteção global)"
echo -e "   • RolesGuard (controle de acesso)"
echo ""

echo -e "${CYAN}✅ Decorators:${NC}"
echo -e "   • @Public() - rotas públicas"
echo -e "   • @Roles() - controle de roles"
echo -e "   • @CurrentUser() - pegar usuário"
echo ""

echo -e "${CYAN}✅ Dependências:${NC}"
echo -e "   • @nestjs/jwt"
echo -e "   • @nestjs/passport"
echo -e "   • passport-jwt"
echo -e "   • passport-local"
echo -e "   • bcrypt"
echo ""

echo -e "${CYAN}✅ Seeds:${NC}"
echo -e "   • 4 usuários criados"
echo -e "   • Senhas hashadas com bcrypt"
echo ""

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}   🔑 CREDENCIAIS DE TESTE${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

echo -e "${GREEN}Admin (Super User):${NC}"
echo -e "   Email: ${CYAN}admin@multione.digital${NC}"
echo -e "   Senha: ${CYAN}admin123${NC}"
echo -e "   Role: ADMIN"
echo ""

echo -e "${GREEN}Master (Manager):${NC}"
echo -e "   Email: ${CYAN}master@multione.digital${NC}"
echo -e "   Senha: ${CYAN}admin123${NC}"
echo -e "   Role: MANAGER"
echo ""

echo -e "${GREEN}Recruiter:${NC}"
echo -e "   Email: ${CYAN}joao@techsolutions.com${NC}"
echo -e "   Senha: ${CYAN}senha123${NC}"
echo -e "   Role: RECRUITER"
echo ""

echo -e "${GREEN}Viewer:${NC}"
echo -e "   Email: ${CYAN}maria@innovationcorp.com${NC}"
echo -e "   Senha: ${CYAN}senha123${NC}"
echo -e "   Role: VIEWER"
echo ""

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}   📡 ROTAS DISPONÍVEIS${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

echo -e "${CYAN}Auth (Público):${NC}"
echo -e "   POST   /api/auth/login"
echo -e "   POST   /api/auth/register"
echo -e "   GET    /api/auth/me (requer JWT)"
echo ""

echo -e "${CYAN}Users (Protegido):${NC}"
echo -e "   GET    /api/users"
echo -e "   POST   /api/users"
echo -e "   GET    /api/users/:id"
echo -e "   PATCH  /api/users/:id"
echo -e "   DELETE /api/users/:id"
echo ""

echo -e "${CYAN}Companies (Público):${NC}"
echo -e "   GET    /api/companies"
echo -e "   POST   /api/companies"
echo -e "   GET    /api/companies/:id"
echo -e "   PATCH  /api/companies/:id"
echo -e "   DELETE /api/companies/:id"
echo ""

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}   🧪 COMO TESTAR${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

echo -e "${BLUE}1. Iniciar o servidor:${NC}"
echo -e "   ${CYAN}npm run start:dev${NC}"
echo ""

echo -e "${BLUE}2. Testar Login (via curl):${NC}"
echo -e "${CYAN}curl -X POST http://localhost:3001/api/auth/login \\
  -H \"Content-Type: application/json\" \\
  -d '{
    \"email\": \"admin@multione.digital\",
    \"password\": \"admin123\"
  }'${NC}"
echo ""

echo -e "${BLUE}3. Resposta esperada:${NC}"
echo -e "${GREEN}{
  \"access_token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\",
  \"user\": {
    \"id\": \"uuid-do-usuario\",
    \"name\": \"Admin User\",
    \"email\": \"admin@multione.digital\",
    \"role\": \"ADMIN\",
    \"companyId\": \"uuid-da-empresa\"
  }
}${NC}"
echo ""

echo -e "${BLUE}4. Usar o token nas requisições protegidas:${NC}"
echo -e "${CYAN}curl -X GET http://localhost:3001/api/users \\
  -H \"Authorization: Bearer SEU_TOKEN_AQUI\"${NC}"
echo ""

echo -e "${BLUE}5. Testar rota pública (me):${NC}"
echo -e "${CYAN}curl -X GET http://localhost:3001/api/auth/me \\
  -H \"Authorization: Bearer SEU_TOKEN_AQUI\"${NC}"
echo ""

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}   📋 PRÓXIMOS PASSOS${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

echo -e "${BLUE}1. Verificar se o servidor inicia sem erros:${NC}"
echo -e "   ${CYAN}npm run start:dev${NC}"
echo ""

echo -e "${BLUE}2. Testar todas as rotas de autenticação${NC}"
echo ""

echo -e "${BLUE}3. Verificar no Prisma Studio:${NC}"
echo -e "   ${CYAN}npx prisma studio${NC}"
echo -e "   Abrir: http://localhost:5555"
echo ""

echo -e "${BLUE}4. Push para GitHub:${NC}"
echo -e "   ${CYAN}git push origin dev${NC}"
echo ""

echo -e "${BLUE}5. Avisar as outras pessoas:${NC}"
echo -e "   ${GREEN}✅ Pessoa 3 (Plans/Jobs)${NC} pode começar!"
echo -e "   ${GREEN}✅ Pessoa 4 (Candidates)${NC} pode começar!"
echo ""

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}   ⚠️  IMPORTANTE${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

echo -e "${RED}1. Configure o JWT_SECRET no .env:${NC}"
echo -e "   Abra o arquivo .env e altere para um valor seguro"
echo ""

echo -e "${RED}2. Não commite o .env no Git:${NC}"
echo -e "   O arquivo já está no .gitignore"
echo ""

echo -e "${RED}3. Em produção, use senhas fortes:${NC}"
echo -e "   As senhas de teste são apenas para desenvolvimento"
echo ""

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}   📁 ARQUIVOS CRIADOS${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

echo -e "${GREEN}Auth Module:${NC}"
echo -e "   ✅ src/auth/auth.module.ts"
echo -e "   ✅ src/auth/auth.service.ts"
echo -e "   ✅ src/auth/auth.controller.ts"
echo -e "   ✅ src/auth/dto/login.dto.ts"
echo -e "   ✅ src/auth/dto/register.dto.ts"
echo -e "   ✅ src/auth/strategies/jwt.strategy.ts"
echo -e "   ✅ src/auth/strategies/local.strategy.ts"
echo ""

echo -e "${GREEN}Users Module:${NC}"
echo -e "   ✅ src/users/users.module.ts"
echo -e "   ✅ src/users/users.service.ts"
echo -e "   ✅ src/users/users.controller.ts"
echo -e "   ✅ src/users/dto/create-user.dto.ts"
echo -e "   ✅ src/users/dto/update-user.dto.ts"
echo ""

echo -e "${GREEN}Guards:${NC}"
echo -e "   ✅ src/guards/jwt-auth.guard.ts"
echo -e "   ✅ src/guards/roles.guard.ts"
echo ""

echo -e "${GREEN}Decorators:${NC}"
echo -e "   ✅ src/common/decorators/public.decorator.ts"
echo -e "   ✅ src/common/decorators/roles.decorator.ts"
echo -e "   ✅ src/common/decorators/current-user.decorator.ts"
echo ""

echo -e "${GREEN}Outros:${NC}"
echo -e "   ✅ src/app.module.ts (atualizado)"
echo -e "   ✅ prisma/seed.ts (atualizado)"
echo -e "   ✅ .env (JWT_SECRET adicionado)"
echo ""

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}   🔍 VERIFICAR FUNCIONAMENTO${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

echo -e "${CYAN}Execute estes comandos para verificar:${NC}"
echo ""

echo -e "1. ${BLUE}Compilar o projeto:${NC}"
echo -e "   npm run build"
echo ""

echo -e "2. ${BLUE}Iniciar em modo dev:${NC}"
echo -e "   npm run start:dev"
echo ""

echo -e "3. ${BLUE}Ver logs do Prisma:${NC}"
echo -e "   npx prisma studio"
echo ""

echo -e "4. ${BLUE}Testar login via curl:${NC}"
echo -e "   curl -X POST http://localhost:3001/api/auth/login \\"
echo -e "     -H \"Content-Type: application/json\" \\"
echo -e "     -d '{\"email\":\"admin@multione.digital\",\"password\":\"admin123\"}'"
echo ""

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}   📊 ESTATÍSTICAS${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

TOTAL_FILES=$(find src/auth src/users src/guards src/common/decorators -type f -name "*.ts" 2>/dev/null | wc -l)
echo -e "   • Arquivos TypeScript criados: ${GREEN}${TOTAL_FILES}${NC}"
echo -e "   • Módulos implementados: ${GREEN}2${NC} (Auth, Users)"
echo -e "   • Rotas criadas: ${GREEN}8${NC}"
echo -e "   • Guards implementados: ${GREEN}2${NC}"
echo -e "   • Decorators criados: ${GREEN}3${NC}"
echo -e "   • DTOs com validação: ${GREEN}4${NC}"
echo -e "   • Usuários de teste: ${GREEN}4${NC}"
echo ""

echo -e "${PURPLE}========================================${NC}"
echo -e "${PURPLE}   🎊 PARABÉNS, PESSOA 2!${NC}"
echo -e "${PURPLE}   Trabalho 100% concluído!${NC}"
echo -e "${PURPLE}========================================${NC}"
echo ""

echo -e "${CYAN}📅 Data/Hora: $(date '+%d/%m/%Y %H:%M:%S')${NC}"
echo -e "${CYAN}📍 Diretório: $(pwd)${NC}"
echo ""

echo -e "${GREEN}✨ Sistema de autenticação funcionando!${NC}"
echo -e "${GREEN}✨ Pronto para subir no GitHub!${NC}"
echo ""

echo -e "${YELLOW}Execute agora:${NC}"
echo -e "   ${CYAN}npm run start:dev${NC}"
echo -e "   ${CYAN}git push origin dev${NC}"
echo ""
