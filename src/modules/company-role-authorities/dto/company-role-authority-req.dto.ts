import { PartialType } from '@nestjs/mapped-types';
import {
  CreateCompanyRoleAuthorityDto
} from './create-company-role-authority.dto';

export class CompanyRoleAuthorityFindParamsReqDto extends PartialType(CreateCompanyRoleAuthorityDto) {
  page: number;
  limit: number;
}
