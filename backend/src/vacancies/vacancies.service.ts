import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';

@Injectable()
export class VacanciesService {
  constructor(private prisma: PrismaService) {}

  async create(createVacancyDto: CreateVacancyDto, userId: string) {
    const { skillIds, companyId, ...vacancyData } = createVacancyDto;

    // Verificar se a empresa existe
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: { plan: true },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    // Verificar limite de vagas do plano
    const vacanciesCount = await this.prisma.vacancy.count({
      where: { companyId },
    });

    if (vacanciesCount >= company.plan.maxVacancies) {
      throw new ForbiddenException(
        `Limite de vagas atingido. Plano ${company.plan.name} permite apenas ${company.plan.maxVacancies} vagas.`
      );
    }

    // Criar vaga
    const vacancy = await this.prisma.vacancy.create({
      data: {
        ...vacancyData,
        company: {
          connect: { id: companyId },
        },
        ...(skillIds && skillIds.length > 0 && {
          vacancySkills: {
            create: skillIds.map(skillId => ({
              skill: { connect: { id: skillId } },
            })),
          },
        }),
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            domain: true,
          },
        },
        vacancySkills: {
          include: {
            skill: true,
          },
        },
      },
    });

    return vacancy;
  }

  async findAll(companyId?: string, status?: string) {
    const where: any = {};

    if (companyId) {
      where.companyId = companyId;
    }

    if (status) {
      where.status = status;
    }

    return this.prisma.vacancy.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            domain: true,
          },
        },
        vacancySkills: {
          include: {
            skill: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const vacancy = await this.prisma.vacancy.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            domain: true,
            plan: {
              select: {
                name: true,
                type: true,
              },
            },
          },
        },
        vacancySkills: {
          include: {
            skill: true,
          },
        },
        applications: {
          include: {
            candidate: {
              select: {
                id: true,
                name: true,
                email: true,
                status: true,
              },
            },
          },
          orderBy: {
            appliedAt: 'desc',
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!vacancy) {
      throw new NotFoundException('Vaga não encontrada');
    }

    return vacancy;
  }

  async update(id: string, updateVacancyDto: UpdateVacancyDto) {
    await this.findOne(id);

    const { skillIds, ...vacancyData } = updateVacancyDto;

    // Se houver skillIds, atualizar relacionamento
    if (skillIds !== undefined) {
      // Remover skills antigas
      await this.prisma.vacancySkill.deleteMany({
        where: { vacancyId: id },
      });

      // Adicionar novas skills
      if (skillIds.length > 0) {
        await this.prisma.vacancySkill.createMany({
          data: skillIds.map(skillId => ({
            vacancyId: id,
            skillId,
          })),
        });
      }
    }

    return this.prisma.vacancy.update({
      where: { id },
      data: vacancyData,
      include: {
        company: true,
        vacancySkills: {
          include: {
            skill: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    // Verificar se há candidaturas
    const applicationsCount = await this.prisma.application.count({
      where: { vacancyId: id },
    });

    if (applicationsCount > 0) {
      // Apenas fechar a vaga ao invés de excluir
      await this.prisma.vacancy.update({
        where: { id },
        data: { status: 'CLOSED' },
      });

      return { 
        message: `Vaga fechada com sucesso. ${applicationsCount} candidatura(s) foram preservadas.` 
      };
    }

    await this.prisma.vacancy.delete({
      where: { id },
    });

    return { message: 'Vaga excluída com sucesso' };
  }

  async getStats(companyId?: string) {
    const where = companyId ? { companyId } : {};

    const [total, open, closed, draft, totalApplications] = await Promise.all([
      this.prisma.vacancy.count({ where }),
      this.prisma.vacancy.count({ where: { ...where, status: 'OPEN' } }),
      this.prisma.vacancy.count({ where: { ...where, status: 'CLOSED' } }),
      this.prisma.vacancy.count({ where: { ...where, status: 'DRAFT' } }),
      this.prisma.application.count({
        where: companyId ? { vacancy: { companyId } } : {},
      }),
    ]);

    return {
      total,
      open,
      closed,
      draft,
      totalApplications,
    };
  }
}
