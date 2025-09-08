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
  
  @ApiProperty({ required: false, example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsMongoId()
  companyId?: string;
  
  @ApiProperty({ required: false, example: '507f1f77bcf86cd799439012' })
  @IsOptional()
  @IsMongoId()
  courseId?: string;
  
  @ApiProperty({ required: false, example: '507f1f77bcf86cd799439013' })
  @IsOptional()
  @IsMongoId()
  branchId?: string;
}
