export class CompanyRolesForCompanyResDto {
  models: CompanyRoleForCompany[] = [];
}

export class CompanyRoleForCompany {
  company_role_id: string;
  company_id: string;
  name: string;
  description: string;
  priority: number;
  status: string;
}
