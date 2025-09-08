import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';

export class RoleFindParamsReqDto extends PartialType(CreateRoleDto) {
    page: number;
    limit: number;
}
