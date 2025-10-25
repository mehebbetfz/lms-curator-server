import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthorityDto } from './create-authority.dto';

export class AuthorityFindParamsReqDto extends PartialType(CreateAuthorityDto) {
    page: string;
    limit: string;
}
