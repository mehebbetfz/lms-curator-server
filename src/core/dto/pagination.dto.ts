import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsString } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'PAGE_MUST_BE_INTEGER' })
  @Min(1, { message: 'PAGE_MIN_VALUE_IS_1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'LIMIT_MUST_BE_INTEGER' })
  @Min(1, { message: 'LIMIT_MIN_VALUE_IS_1' })
  limit?: number = 10;

  @IsOptional()
  @IsString({ message: 'SORT_BY_NEED_TO_BE_STRING' })
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString({ message: 'SORT_ORDER_NEED_TO_BE_STRING' })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
