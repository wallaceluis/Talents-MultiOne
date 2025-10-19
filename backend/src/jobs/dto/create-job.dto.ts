import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsNotEmpty,
} from "class-validator";

export enum VacancyType {
  CLT = "CLT",
  PJ = "PJ",
  INTERNSHIP = "INTERNSHIP",
  TEMPORARY = "TEMPORARY",
  FREELANCE = "FREELANCE",
}

export enum VacancyStatus {
  DRAFT = "DRAFT",
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  CANCELLED = "CANCELLED",
}

export enum WorkModel {
  REMOTE = "REMOTE",
  ONSITE = "ONSITE",
  HYBRID = "HYBRID",
}

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  companyId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsOptional()
  salary?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(VacancyType)
  @IsOptional()
  type?: VacancyType;

  @IsEnum(VacancyStatus)
  @IsOptional()
  status?: VacancyStatus;

  @IsEnum(WorkModel)
  @IsOptional()
  workModel?: WorkModel;
}
