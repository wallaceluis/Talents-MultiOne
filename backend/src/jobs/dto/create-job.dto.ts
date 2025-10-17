import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsNotEmpty,
} from "class-validator";

export enum JobType {
  CLT = "CLT",
  ESTAGIO = "Estagio",
  PJ = "PJ",
  JOVEM_APRENDIZ = "Jovem Aprendiz",
}

export enum JobStatus {
  ATIVA = "Ativa",
  PAUSADA = "Pausada",
  FECHADA = "Fechada",
}

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  requirements: string;

  @IsNumber()
  @IsOptional()
  salary?: number;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsEnum(JobType)
  type: JobType;

  @IsEnum(JobStatus)
  status: JobStatus;
}
