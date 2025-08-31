import {
  IsOptional,
  IsString,
  IsEnum,
  IsEmail,
  IsDateString,
} from 'class-validator';
import { UserStatus } from '../../../core/enums/user-status.enum';

export class UserSearchDto {
  @IsOptional()
  @IsString({ message: 'USERNAME_NEED_TO_BE_STRING' })
  username?: string;

  @IsOptional()
  @IsString({ message: 'FIRST_NAME_NEED_TO_BE_STRING' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'LAST_NAME_NEED_TO_BE_STRING' })
  lastName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'EMAIL_IS_INVALID' })
  email?: string;

  @IsOptional()
  @IsEnum(UserStatus, { message: 'STATUS_IS_INVALID' })
  status?: UserStatus;

  @IsOptional()
  @IsDateString({}, { message: 'CREATED_AT_DATE_INVALID' })
  createdAtFrom?: Date;

  @IsOptional()
  @IsDateString({}, { message: 'CREATED_AT_DATE_INVALID' })
  createdAtTo?: Date;
}
