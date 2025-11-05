import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  async create(createPlanDto: CreatePlanDto) {
    // Verificar se já existe plano com mesmo nome
    const existingPlan = await this.prisma.plan.findFirst({
      where: {
        name: createPlanDto.name,
      },
    });

    if (existingPlan) {
      throw new ConflictException('Já existe um plano com este nome');
    }

    return this.prisma.plan.create({
      data: createPlanDto,
    });
  }

  async findAll() {
    return this.prisma.plan.findMany({
      include: {
        _count: {
          select: {
            companies: true,
          },
        },
      },
      orderBy: {
        price: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { id },
      include: {
        companies: {
          select: {
            id: true,
            name: true,
            domain: true,
            status: true,
          },
        },
        _count: {
          select: {
            companies: true,
          },
        },
      },
    });

    if (!plan) {
      throw new NotFoundException('Plano não encontrado');
    }

    return plan;
  }

  async update(id: string, updatePlanDto: UpdatePlanDto) {
    await this.findOne(id);

    return this.prisma.plan.update({
      where: { id },
      data: updatePlanDto,
    });
  }

  async remove(id: string) {
    const plan = await this.findOne(id);

    // Verificar se há empresas usando este plano
    const companiesCount = await this.prisma.company.count({
      where: { planId: id },
    });

    if (companiesCount > 0) {
      throw new ConflictException(
        `Não é possível excluir este plano. ${companiesCount} empresa(s) estão usando-o.`
      );
    }

    await this.prisma.plan.delete({
      where: { id },
    });

    return { message: 'Plano excluído com sucesso' };
  }

  async getStats() {
    const [total, companiesByPlan] = await Promise.all([
      this.prisma.plan.count(),
      this.prisma.plan.findMany({
        select: {
          name: true,
          _count: {
            select: {
              companies: true,
            },
          },
        },
      }),
    ]);

    return {
      total,
      companiesByPlan: companiesByPlan.map(plan => ({
        planName: plan.name,
        companies: plan._count.companies,
      })),
    };
  }
}
