import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum, IsUUID, IsDateString } from 'class-validator';
import { CandidateStatus } from '@prisma/client';

export class CreateCandidateDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  cpf?: string;

  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  zipCode?: string;

  @IsString()
  @IsOptional()
  linkedin?: string;

  @IsString()
  @IsOptional()
  github?: string;

  @IsString()
  @IsOptional()
  portfolio?: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsEnum(CandidateStatus, { message: 'Status inválido' })
  @IsOptional()
  status?: CandidateStatus;

  @IsUUID('4', { message: 'Company ID inválido' })
  @IsNotEmpty({ message: 'Company ID é obrigatório' })
  companyId: string;

  @IsOptional()
  @IsUUID('4', { each: true })
  skillIds?: string[];
}
