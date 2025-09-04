import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
  @ApiProperty({ required: false, example: 'refresh_token_string_here' })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
