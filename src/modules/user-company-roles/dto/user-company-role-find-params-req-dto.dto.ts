import { PartialType } from '@nestjs/mapped-types';
import { CreateUserCompanyRoleDto } from './create-user-company-role.dto';

export class UserCompanyRoleFindParamsReqDto extends PartialType(CreateUserCompanyRoleDto) {
    page: number;
    limit: number;
}
