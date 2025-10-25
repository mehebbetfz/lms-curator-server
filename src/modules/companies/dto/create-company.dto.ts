import { IsString, IsEmail, MaxLength } from 'class-validator';

export class CreateCompanyDto {
  @IsString({ message: 'NAME_NEED_TO_BE_STRING' })
  @MaxLength(100, { message: 'NAME_IS_TOO_LONG' })
  name: string;
  
  @IsString({ message: 'DESCRIPTION_NEED_TO_BE_STRING' })
  @MaxLength(300, { message: 'DESCRIPTION_IS_TOO_LONG' })
  description: string;
}
