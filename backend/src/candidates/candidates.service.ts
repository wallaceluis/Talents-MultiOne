import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CandidatesService {
  constructor(private prisma: PrismaService) {}

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
            candidateSkills: true,
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
        candidateSkills: {
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
            appliedAt: 'desc',
          },
        },
      },
    });

    if (!candidate) {
      throw new NotFoundException('Candidato não encontrado');
    }

    return candidate;
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
}
