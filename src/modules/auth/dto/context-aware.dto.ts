// context-aware.dto.ts
import { IsOptional, IsMongoId } from 'class-validator';

export class ContextAwareDto {
  @IsOptional()
  @IsMongoId()
  companyId?: string;
  
  @IsOptional()
  @IsMongoId()
  courseId?: string;
  
  @IsOptional()
  @IsMongoId()
  branchId?: string;
}

export class CompanyContextDto extends ContextAwareDto {
  @IsMongoId()
  declare companyId: string;
}

export class CourseContextDto extends ContextAwareDto {
  @IsMongoId()
  declare courseId: string;
}
