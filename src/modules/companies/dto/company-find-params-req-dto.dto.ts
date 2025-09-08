import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';

export class CompanyFindParamsReqDto extends PartialType(CreateCompanyDto) {
    page: number;
    limit: number;
}
