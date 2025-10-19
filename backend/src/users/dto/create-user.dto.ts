import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Senha deve conter letras maiúsculas, minúsculas e números',
  })
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
