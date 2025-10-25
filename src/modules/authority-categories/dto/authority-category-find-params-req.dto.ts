import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthorityCategoryDto } from './create-authority-category.dto';

export class AuthorityCategoryFindParamsReqDto extends PartialType(CreateAuthorityCategoryDto) {
    page: number;
    limit: number;
}
