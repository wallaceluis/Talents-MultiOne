import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
  IsBoolean,
} from "class-validator";

export enum PlanType {
  FREE = "FREE",
  BASIC = "BASIC",
  PREMIUM = "PREMIUM",
  ENTERPRISE = "ENTERPRISE",
}

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @IsNumber()
  @Min(1)
  maxApplicationsPerJob: number;

  @IsNumber()
  @Min(1)
  maxUsers: number;

  @IsNumber()
  @Min(1)
  maxCandidates: number;

  @IsNumber()
  @Min(1)
  maxVacancies: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  features: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsEnum(PlanType)
  @IsOptional()
  type?: PlanType;
}
