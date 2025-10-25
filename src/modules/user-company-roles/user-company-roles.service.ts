import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/services/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCompanyRole } from './schemas/user-company-role.schema';

@Injectable()
export class UserCompanyRolesService extends BaseService<UserCompanyRole> {
  constructor(
    @InjectModel(UserCompanyRole.name) private readonly userRoleModel: Model<UserCompanyRole>,
  ) {
    super(userRoleModel, UserCompanyRole.name);
  }
}
