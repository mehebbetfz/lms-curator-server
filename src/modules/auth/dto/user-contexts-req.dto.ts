import { UserCompaniesReqDto } from './user-companies-req.dto';
import { UserCoursesReqDto } from './user-courses-req.dto';
import { UserBranchesReqDto } from './user-branches-req.dto';

export class UserContextsReqDto {
  companies: UserCompaniesReqDto[];
  courses: UserCoursesReqDto[];
  branches: UserBranchesReqDto[];
}
