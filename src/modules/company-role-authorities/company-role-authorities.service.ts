import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/services/base.service';
import { CompanyRoleAuthority } from './schemas/company-role-authority.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CompanyRoleAuthoritiesService extends BaseService<CompanyRoleAuthority> {
  constructor(
    @InjectModel(CompanyRoleAuthority.name) private readonly companyRoleAuthorityModel: Model<CompanyRoleAuthority>,
  ) {
    super(companyRoleAuthorityModel, CompanyRoleAuthority.name);
  }
}
