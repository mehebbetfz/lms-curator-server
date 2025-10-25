import {
  IsEnum,
  IsNumber, IsOptional,
  IsString, Max, MaxLength, Min,
} from 'class-validator';
import mongoose from 'mongoose';
import { RoleStatus } from '../../../core/enums/role-status.enum';

export class CreateCompanyRoleDto {
  @IsString({ message: 'ID_NEED_TO_BE_STRING' })
  company_id: mongoose.Schema.Types.ObjectId;
  
  @IsString({ message: 'NAME_NEED_TO_BE_STRING' })
  @MaxLength(100, { message: 'NAME_IS_TOO_LONG' })
  name: string;
  
  @IsNumber({}, { message: 'PRIORITY_NEED_TO_BE_NUMBER' })
  @Min(0, { message: 'PRIORITY_MIN_0' })
  @Max(1000, { message: 'PRIORITY_MAX_1000' })
  priority: number;
  
  @IsOptional()
  @IsEnum(RoleStatus, { message: 'STATUS_IS_INVALID' })
  status?: RoleStatus;
  
  @IsOptional()
  @IsString({ message: 'DESCRIPTION_NEED_TO_BE_STRING' })
  @MaxLength(500, { message: 'DESCRIPTION_IS_TOO_LONG' })
  description?: string;
}

