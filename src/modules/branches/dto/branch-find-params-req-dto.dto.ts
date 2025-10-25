import { PartialType } from '@nestjs/mapped-types';
import { CreateBranchDto } from './create-branch.dto';

export class BranchFindParamsReqDto extends PartialType(CreateBranchDto) {
    page: number;
    limit: number;
}
