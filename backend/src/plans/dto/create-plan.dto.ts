import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreatePlanDto {
  @IsString({ message: 'Nome é obrigatório' })
  name: string;

  @IsNumber({}, { message: 'Máximo de vagas deve ser um número' })
  @Min(0)
  maxVacancies: number;

  @IsNumber({}, { message: 'Máximo de candidatos deve ser um número' })
  @Min(0)
  maxCandidates: number;

  @IsNumber({}, { message: 'Máximo de usuários deve ser um número' })
  @Min(0)
  maxUsers: number;

  @IsNumber({}, { message: 'Preço deve ser um número' })
  @Min(0)
  price: number;
}
