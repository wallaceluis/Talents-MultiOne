import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperiencesService {
  constructor(private prisma: PrismaService) {}

  async create(createExperienceDto: CreateExperienceDto) {
    return this.prisma.experience.create({
      data: createExperienceDto,
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

    return this.prisma.experience.findMany({
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
    const experience = await this.prisma.experience.findUnique({
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

    if (!experience) {
      throw new NotFoundException('Experiência não encontrada');
    }

    return experience;
  }

  async update(id: string, updateExperienceDto: UpdateExperienceDto) {
    await this.findOne(id);

    return this.prisma.experience.update({
      where: { id },
      data: updateExperienceDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.experience.delete({
      where: { id },
    });

    return { message: 'Experiência excluída com sucesso' };
  }
}
