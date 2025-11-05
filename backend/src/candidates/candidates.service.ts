import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';

@Injectable()
export class CandidatesService {
  constructor(private prisma: PrismaService) {}

  async create(createCandidateDto: CreateCandidateDto) {
    const { skillIds, companyId, ...candidateData } = createCandidateDto;

    // Verificar se email já existe (usar findFirst ao invés de findUnique)
    const existingCandidate = await this.prisma.candidate.findFirst({
      where: { email: createCandidateDto.email },
    });

    if (existingCandidate) {
      throw new ConflictException('Candidato com este email já existe');
    }

    // Verificar limite de candidatos do plano
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: { plan: true },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    const candidatesCount = await this.prisma.candidate.count({
      where: { companyId },
    });

    if (candidatesCount >= company.plan.maxCandidates) {
      throw new ForbiddenException(
        `Limite de candidatos atingido. Plano ${company.plan.name} permite apenas ${company.plan.maxCandidates} candidatos.`
      );
    }

    // Criar candidato
    return this.prisma.candidate.create({
      data: {
        ...candidateData,
        company: {
          connect: { id: companyId },
        },
        ...(skillIds && skillIds.length > 0 && {
          skills: {
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
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });
  }

  async findAll(companyId?: string) {
    const where: any = {};
    
    if (companyId) {
      where.companyId = companyId;
    }

    return this.prisma.candidate.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
        company: {
          select: {
            id: true,
            name: true,
            domain: true,
          },
        },
        _count: {
          select: {
            skills: true,
            experiences: true,
            educations: true,
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
    const candidate = await this.prisma.candidate.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            domain: true,
          },
        },
        skills: {
          include: {
            skill: true,
          },
        },
        experiences: {
          orderBy: {
            startDate: 'desc',
          },
        },
        educations: {
          orderBy: {
            startDate: 'desc',
          },
        },
        applications: {
          include: {
            vacancy: {
              select: {
                id: true,
                title: true,
                company: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!candidate) {
      throw new NotFoundException('Candidato não encontrado');
    }

    return candidate;
  }

  async update(id: string, updateCandidateDto: UpdateCandidateDto) {
    await this.findOne(id);

    const { skillIds, ...candidateData } = updateCandidateDto;

    // Se houver skillIds, atualizar relacionamento
    if (skillIds !== undefined) {
      // Remover skills antigas
      await this.prisma.candidateSkill.deleteMany({
        where: { candidateId: id },
      });

      // Adicionar novas skills
      if (skillIds.length > 0) {
        await this.prisma.candidateSkill.createMany({
          data: skillIds.map(skillId => ({
            candidateId: id,
            skillId,
          })),
        });
      }
    }

    return this.prisma.candidate.update({
      where: { id },
      data: candidateData,
      include: {
        company: true,
        skills: {
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
      where: { candidateId: id },
    });

    if (applicationsCount > 0) {
      // Apenas desativar ao invés de excluir
      await this.prisma.candidate.update({
        where: { id },
        data: { status: 'INACTIVE' },
      });

      return { 
        message: `Candidato desativado com sucesso. ${applicationsCount} candidatura(s) foram preservadas.` 
      };
    }

    await this.prisma.candidate.delete({
      where: { id },
    });

    return { message: 'Candidato excluído com sucesso' };
  }

  async getStats() {
    const [total, active, inProcess, hired] = await Promise.all([
      this.prisma.candidate.count(),
      this.prisma.candidate.count({ where: { status: 'ACTIVE' } }),
      this.prisma.candidate.count({ where: { status: 'IN_PROCESS' } }),
      this.prisma.candidate.count({ where: { status: 'HIRED' } }),
    ]);

    return {
      total,
      active,
      inProcess,
      hired,
    };
  }

  // Gerenciar Skills do Candidato
  async addSkill(candidateId: string, skillId: string) {
    await this.findOne(candidateId);

    // Verificar se skill já existe
    const existing = await this.prisma.candidateSkill.findUnique({
      where: {
        candidateId_skillId: {
          candidateId,
          skillId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Skill já adicionada a este candidato');
    }

    return this.prisma.candidateSkill.create({
      data: {
        candidateId,
        skillId,
      },
      include: {
        skill: true,
      },
    });
  }

  async removeSkill(candidateId: string, skillId: string) {
    await this.findOne(candidateId);

    const candidateSkill = await this.prisma.candidateSkill.findUnique({
      where: {
        candidateId_skillId: {
          candidateId,
          skillId,
        },
      },
    });

    if (!candidateSkill) {
      throw new NotFoundException('Skill não encontrada para este candidato');
    }

    await this.prisma.candidateSkill.delete({
      where: {
        candidateId_skillId: {
          candidateId,
          skillId,
        },
      },
    });

    return { message: 'Skill removida com sucesso' };
  }
}
