#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Corrigindo erros de TypeScript...${NC}"
echo ""

# ========================================
# ERRO 1: auth.module.ts - remover async
# ========================================
echo -e "${YELLOW}[1/2] Corrigindo auth.module.ts...${NC}"

cat > src/auth/auth.module.ts << 'AUTHMODULE'
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
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '7d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
AUTHMODULE

echo -e "${GREEN}✅ auth.module.ts corrigido!${NC}"
echo ""

# ========================================
# ERRO 2, 3, 4, 5: users.service.ts
# ========================================
echo -e "${YELLOW}[2/2] Corrigindo users.service.ts...${NC}"

cat > src/users/users.service.ts << 'USERSERVICE'
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

    // NÃO fazer hash aqui - já vem hasheado do auth.service
    const { companyId, ...userData } = createUserDto;
    
    const { password, ...user } = await this.prisma.user.create({
      data: {
        ...userData,
        status: 'ACTIVE',
        ...(companyId && { 
          company: { 
            connect: { id: companyId } 
          } 
        }),
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

    // Separar companyId do resto dos dados
    const { companyId, password, ...restData } = updateUserDto;

    // Preparar dados para atualização
    const dataToUpdate: any = {
      ...restData,
    };

    // Hash da senha se fornecida
    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    // Atualizar company apenas se companyId foi fornecido
    if (companyId !== undefined) {
      if (companyId === null) {
        dataToUpdate.company = { disconnect: true };
      } else {
        dataToUpdate.company = { connect: { id: companyId } };
      }
    }

    const { password: _, ...user } = await this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
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
USERSERVICE

echo -e "${GREEN}✅ users.service.ts corrigido!${NC}"
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   ✅ ERROS CORRIGIDOS!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

echo -e "${YELLOW}Testando compilação...${NC}"
npm run build

