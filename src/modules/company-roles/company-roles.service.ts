import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/services/base.service';
import { CompanyRole } from './schemas/company-role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CompanyRolesService extends BaseService<CompanyRole> {
  constructor(
    @InjectModel(CompanyRole.name) private readonly companyRoleModel: Model<CompanyRole>,
  ) {
    super(companyRoleModel, CompanyRole.name);
  }
}
