import { IsString, IsOptional, IsEnum, IsNumber, Min, IsArray } from 'class-validator';
import { VacancyStatus, VacancyType } from '@prisma/client';

export class CreateVacancyDto {
  @IsString({ message: 'Título é obrigatório' })
  title: string;

  @IsString({ message: 'Descrição é obrigatória' })
  description: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(VacancyType, { message: 'Tipo de vaga inválido' })
  @IsOptional()
  type?: VacancyType;

  @IsNumber()
  @Min(0)
  @IsOptional()
  salary?: number;

  @IsString({ message: 'ID da empresa é obrigatório' })
  companyId: string;

  @IsEnum(VacancyStatus, { message: 'Status inválido' })
  @IsOptional()
  status?: VacancyStatus;

  @IsArray()
  @IsOptional()
  skillIds?: string[];
}
