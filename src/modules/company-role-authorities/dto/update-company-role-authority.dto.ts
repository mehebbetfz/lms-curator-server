import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyRoleAuthorityDto } from './create-company-role-authority.dto';

export class UpdateCompanyRoleAuthorityDto extends PartialType(CreateCompanyRoleAuthorityDto) {}
