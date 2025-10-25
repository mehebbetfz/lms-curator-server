import { UserCompaniesResDto } from './user-companies-res.dto';
import { UserCoursesResDto } from './user-courses-res.dto';
import { UserBranchesResDto } from './user-branches-res.dto';

export class UserContextsResDto {
  companies: UserCompaniesResDto[];
  courses: UserCoursesResDto[];
  branches: UserBranchesResDto[];
}
