import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyStatus } from '@prisma/client';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) { }

  async create(createCompanyDto: CreateCompanyDto) {
    const existingCompany = await this.prisma.company.findUnique({
      where: { domain: createCompanyDto.domain },
    });

    if (existingCompany) {
      throw new ConflictException('Domínio já cadastrado');
    }

    const { planId, status, ...companyData } = createCompanyDto;

    return this.prisma.company.create({
      data: {
        ...companyData,
        status: status ? (status as CompanyStatus) : CompanyStatus.ACTIVE,
        ...(planId && {
          plan: {
            connect: { id: planId },
          },
        }),
      },
      include: {
        plan: true,
      },
    });
  }

  async findAll() {
    return this.prisma.company.findMany({
      include: {
        plan: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            users: true,
            candidates: true,
            vacancies: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        plan: true,
        _count: {
          select: {
            users: true,
            candidates: true,
            vacancies: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    await this.findOne(id);

    const { planId, status, ...companyData } = updateCompanyDto;

    return this.prisma.company.update({
      where: { id },
      data: {
        ...companyData,
        ...(status && { status: status as CompanyStatus }),
        ...(planId !== undefined && {
          plan: planId ? { connect: { id: planId } } : { disconnect: true },
        }),
      },
      include: {
        plan: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.company.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });

    return { message: 'Empresa desativada com sucesso' };
  }

  async getStats() {
    const [total, active, inactive] = await Promise.all([
      this.prisma.company.count(),
      this.prisma.company.count({ where: { status: 'ACTIVE' } }),
      this.prisma.company.count({ where: { status: 'INACTIVE' } }),
    ]);

    return {
      total,
      active,
      inactive,
    };
  }
}
