import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ example: 'refresh_token_string_here' })
  @IsString()
  refreshToken: string;
}
