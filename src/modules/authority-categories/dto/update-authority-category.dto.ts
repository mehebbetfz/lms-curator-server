import { IsString, MaxLength } from 'class-validator';

export class UpdateAuthorityCategoryDto {
  @IsString({ message: 'NAME_IS_INVALID' })
  @MaxLength(100, { message: 'NAME_IS_TOO_LONG' })
  name: string;
}
