import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsDateString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { UserStatus } from '../../../core/enums/user-status.enum';

export class CreateUserDto {
  @IsEmail({}, { message: 'EMAIL_IS_INVALID' })
  @MaxLength(100, { message: 'EMAIL_IS_TOO_LONG' })
  email: string;
  
  @IsString({ message: 'FIRST_NAME_NEED_TO_BE_STRING' })
  @MaxLength(50, { message: 'FIRST_NAME_IS_TOO_LONG' })
  firstName: string;
  
  @IsString({ message: 'LAST_NAME_NEED_TO_BE_STRING' })
  @MaxLength(50, { message: 'LAST_NAME_IS_TOO_LONG' })
  lastName: string;
  
  @IsOptional()
  @IsString({ message: 'MIDDLE_NAME_NEED_TO_BE_STRING' })
  @MaxLength(50, { message: 'MIDDLE_NAME_IS_TOO_LONG' })
  middleName?: string;
  
  @IsOptional()
  @IsString({ message: 'PHONE_NEED_TO_BE_STRING' })
  phone: string;
  
  @IsOptional()
  @IsString({ message: 'PHONE_NEED_TO_BE_STRING' })
  whatsappPhone?: string;
  
  @IsOptional()
  @IsDateString({}, { message: 'DATE_OF_BIRTH_IS_INVALID' })
  dateOfBirth?: Date;
  
  @IsOptional()
  @IsEnum(UserStatus, { message: 'STATUS_IS_INVALID' })
  status?: UserStatus;
}
