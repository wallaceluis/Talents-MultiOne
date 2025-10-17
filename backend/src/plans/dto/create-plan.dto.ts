import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
} from "class-validator";

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @IsNumber()
  @Min(1)
  maxApplicationsPerJob: number;

  @IsNumber()
  @Min(1)
  maxJobs: number;

  @IsNumber()
  @Min(0)
  durationDays: number;
}
