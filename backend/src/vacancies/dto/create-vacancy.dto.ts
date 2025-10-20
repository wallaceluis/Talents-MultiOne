import { IsString, IsNotEmpty, IsEnum, IsNumber, IsArray, IsOptional, IsUUID, Min, Max } from 'class-validator';
import { VacancyStatus, VacancyType, WorkModel } from '@prisma/client';

export class CreateVacancyDto {
  @IsString()
  @IsNotEmpty({ message: 'Título é obrigatório' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  description: string;

  @IsString()
  @IsOptional()
  requirements?: string;

  @IsString()
  @IsOptional()
  benefits?: string;

  @IsEnum(VacancyType, { message: 'Tipo de vaga inválido' })
  @IsNotEmpty({ message: 'Tipo de vaga é obrigatório' })
  type: VacancyType;

  @IsEnum(WorkModel, { message: 'Modelo de trabalho inválido' })
  @IsNotEmpty({ message: 'Modelo de trabalho é obrigatório' })
  workModel: WorkModel;

  @IsString()
  @IsNotEmpty({ message: 'Localização é obrigatória' })
  location: string;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Salário mínimo não pode ser negativo' })
  salaryMin?: number;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Salário máximo não pode ser negativo' })
  salaryMax?: number;

  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'Experiência mínima deve ser no mínimo 1 ano' })
  @Max(50, { message: 'Experiência mínima deve ser no máximo 50 anos' })
  experienceYears?: number;

  @IsEnum(VacancyStatus, { message: 'Status inválido' })
  @IsOptional()
  status?: VacancyStatus;

  @IsUUID('4', { message: 'Company ID inválido' })
  @IsNotEmpty({ message: 'Company ID é obrigatório' })
  companyId: string;

  @IsArray()
  @IsUUID('4', { each: true, message: 'Skill ID inválido' })
  @IsOptional()
  skillIds?: string[];
}
