import { PartialType } from '@nestjs/mapped-types';
import { CreateUserCompanyRoleDto } from './create-user-company-role.dto';

export class UpdateUserCompanyRoleDto extends PartialType(CreateUserCompanyRoleDto) {}
