import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  async create(createPlanDto: CreatePlanDto) {
    // Verificar se já existe plano com mesmo tipo
    const existingPlan = await this.prisma.plan.findFirst({
      where: { 
        type: createPlanDto.type,
        isActive: true 
      },
    });

    if (existingPlan) {
      throw new ConflictException(`Já existe um plano ativo do tipo ${createPlanDto.type}`);
    }

    return this.prisma.plan.create({
      data: createPlanDto,
    });
  }

  async findAll(includeInactive = false) {
    const where = includeInactive ? {} : { isActive: true };

    return this.prisma.plan.findMany({
      where,
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

  async findByType(type: string) {
    return this.prisma.plan.findFirst({
      where: { 
        type: type as any,
        isActive: true 
      },
    });
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
    const [total, active, companiesByPlan] = await Promise.all([
      this.prisma.plan.count(),
      this.prisma.plan.count({ where: { isActive: true } }),
      this.prisma.plan.findMany({
        select: {
          name: true,
          type: true,
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
      active,
      companiesByPlan: companiesByPlan.map(plan => ({
        planName: plan.name,
        planType: plan.type,
        companies: plan._count.companies,
      })),
    };
  }
}
