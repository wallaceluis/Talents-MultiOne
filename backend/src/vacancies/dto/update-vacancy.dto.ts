import { PartialType } from '@nestjs/mapped-types';
import { CreateVacancyDto } from './create-vacancy.dto';
import { IsArray, IsOptional } from 'class-validator';

export class UpdateVacancyDto extends PartialType(CreateVacancyDto) {
  @IsArray()
  @IsOptional()
  skillIds?: string[];
}
