import { IsString, MaxLength } from 'class-validator';

export class CreateSchoolDto {
  @IsString({ message: 'NAME_IS_INVALID' })
  @MaxLength(100, { message: 'NAME_IS_TOO_LONG' })
  name: string;
  
  @IsString({ message: 'COMPANY_ID_NEED_TO_BE_STRING' })
  company_id: string;
}
