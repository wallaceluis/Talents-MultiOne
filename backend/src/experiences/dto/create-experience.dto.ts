import { IsString, IsNotEmpty, IsDateString, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  @IsNotEmpty({ message: 'Empresa é obrigatória' })
  company: string;

  @IsString()
  @IsNotEmpty({ message: 'Cargo é obrigatório' })
  position: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Data de início é obrigatória' })
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsBoolean()
  @IsOptional()
  isCurrent?: boolean;

  @IsUUID('4', { message: 'Candidate ID inválido' })
  @IsNotEmpty({ message: 'Candidate ID é obrigatório' })
  candidateId: string;
}
