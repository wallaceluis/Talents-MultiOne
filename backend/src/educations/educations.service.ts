import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Injectable()
export class EducationsService {
  constructor(private prisma: PrismaService) {}

  async create(createEducationDto: CreateEducationDto) {
    return this.prisma.education.create({
      data: createEducationDto,
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(candidateId?: string) {
    const where = candidateId ? { candidateId } : {};

    return this.prisma.education.findMany({
      where,
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const education = await this.prisma.education.findUnique({
      where: { id },
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!education) {
      throw new NotFoundException('Educação não encontrada');
    }

    return education;
  }

  async update(id: string, updateEducationDto: UpdateEducationDto) {
    await this.findOne(id);

    return this.prisma.education.update({
      where: { id },
      data: updateEducationDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.education.delete({
      where: { id },
    });

    return { message: 'Educação excluída com sucesso' };
  }
}
