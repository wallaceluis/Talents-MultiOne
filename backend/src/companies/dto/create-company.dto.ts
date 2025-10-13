import { IsNotEmpty, IsString, Matches } from "class-validator";


export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @Matches(/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/, {
    message: 'Domain deve ter formato válido (ex: empresa.com)'
  })
  @IsNotEmpty()
  domain: string;

}
