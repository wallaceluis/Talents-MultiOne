import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { EducationLevel, EducationStatus } from '@prisma/client';

export class CreateEducationDto {
  @IsString()
  @IsNotEmpty({ message: 'Instituição é obrigatória' })
  institution: string;

  @IsString()
  @IsNotEmpty({ message: 'Curso é obrigatório' })
  degree: string;

  @IsString()
  @IsOptional()
  fieldOfStudy?: string;

  @IsEnum(EducationLevel, { message: 'Nível de educação inválido' })
  @IsNotEmpty({ message: 'Nível é obrigatório' })
  level: EducationLevel;

  @IsEnum(EducationStatus, { message: 'Status inválido' })
  @IsNotEmpty({ message: 'Status é obrigatório' })
  status: EducationStatus;

  @IsDateString()
  @IsNotEmpty({ message: 'Data de início é obrigatória' })
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsUUID('4', { message: 'Candidate ID inválido' })
  @IsNotEmpty({ message: 'Candidate ID é obrigatório' })
  candidateId: string;
}
