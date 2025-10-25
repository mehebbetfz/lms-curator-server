// dto/login.dto.ts
import { IsString, MinLength, IsOptional, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ required: true })
  @IsString()
  username: string;
  
  @ApiProperty({ required: true })
  @IsString()
  @MinLength(6)
  password: string;
}
