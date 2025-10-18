import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;

  @IsEnum(['ADMIN', 'MANAGER', 'RECRUITER', 'VIEWER'], {
    message: 'Role deve ser: ADMIN, MANAGER, RECRUITER ou VIEWER',
  })
  @IsNotEmpty({ message: 'Role é obrigatório' })
  role: string;

  @IsString()
  @IsOptional()
  companyId?: string;
}
