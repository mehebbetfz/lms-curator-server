import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString({ message: 'OLD_PASSWORD_NEED_TO_BE_STRING' })
  oldPassword: string;

  @IsString({ message: 'NEW_PASSWORD_NEED_TO_BE_STRING' })
  @MinLength(8, { message: 'PASSWORD_IS_TOO_SHORT' })
  @MaxLength(64, { message: 'PASSWORD_IS_TOO_LONG' })
  newPassword: string;
}
