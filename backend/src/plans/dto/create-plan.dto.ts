import { IsString, IsNotEmpty, IsEnum, IsNumber, IsArray, IsBoolean, Min } from 'class-validator';
import { PlanType } from '@prisma/client';

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsEnum(PlanType, { message: 'Tipo de plano inválido' })
  @IsNotEmpty({ message: 'Tipo é obrigatório' })
  type: PlanType;

  @IsNumber()
  @Min(1, { message: 'Máximo de usuários deve ser no mínimo 1' })
  maxUsers: number;

  @IsNumber()
  @Min(1, { message: 'Máximo de candidatos deve ser no mínimo 1' })
  maxCandidates: number;

  @IsNumber()
  @Min(1, { message: 'Máximo de vagas deve ser no mínimo 1' })
  maxVacancies: number;

  @IsNumber()
  @Min(0, { message: 'Preço não pode ser negativo' })
  price: number;

  @IsArray()
  @IsString({ each: true })
  features: string[];

  @IsBoolean()
  isActive: boolean;
}
