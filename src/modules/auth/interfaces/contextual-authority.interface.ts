export interface ContextualAuthority {
  authority: string;
  context: {
    companyId?: string;
    courseId?: string;
    branchId?: string;
  };
}
