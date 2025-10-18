import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEnum(['ACTIVE', 'INACTIVE'], {
    message: 'Status deve ser ACTIVE ou INACTIVE',
  })
  @IsOptional()
  status?: string;
}
