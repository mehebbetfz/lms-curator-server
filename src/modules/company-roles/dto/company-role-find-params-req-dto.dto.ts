import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyRoleDto } from './create-company-role.dto';

export class CompanyRoleFindParamsReqDto extends PartialType(CreateCompanyRoleDto) {
    page: number;
    limit: number;
}
