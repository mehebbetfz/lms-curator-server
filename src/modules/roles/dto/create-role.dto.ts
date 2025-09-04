import {
  IsString,
  IsOptional,
  IsEnum,
  MaxLength,
  IsNumber, Min, Max,
} from 'class-validator';
import { RoleStatus } from '../../../core/enums/role-status.enum';

export class CreateRoleDto {
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
