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
    const dataToCreate: any = {
      ...userData,
      status: 'ACTIVE',
    };

    // Só adicionar companyId se existir
    if (companyId) {
      dataToCreate.companyId = companyId;
    }

    const { password, ...user } = await this.prisma.user.create({
      data: dataToCreate,
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

    // Remover companyId se for undefined
    const dataToUpdate: any = { ...updateUserDto };
    if (dataToUpdate.companyId === undefined) {
      delete dataToUpdate.companyId;
    }

    const { password, ...user } = await this.prisma.user.update({
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
