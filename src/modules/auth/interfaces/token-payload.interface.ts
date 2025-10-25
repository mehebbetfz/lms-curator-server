export interface TokenPayload {
  sub: string;
  username: string;
  email: string;
  currentContext?: {
    companyId?: string;
    courseId?: string;
    branchId?: string;
  };
}
