import { IsNotEmpty, IsString, Matches, IsOptional } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsString()
  @Matches(/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/, {
    message: 'Domain deve ter formato válido (ex: empresa.com)',
  })
  @IsNotEmpty({ message: 'Domain é obrigatório' })
  domain: string;

  @IsString()
  @IsOptional()
  planId?: string;
}
