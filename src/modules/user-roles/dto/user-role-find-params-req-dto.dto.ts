import { PartialType } from '@nestjs/mapped-types';
import { CreateUserRoleDto } from './create-user-role.dto';

export class UserRoleFindParamsReqDto extends PartialType(CreateUserRoleDto) {
    page: number;
    limit: number;
}
