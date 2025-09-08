import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/services/base.service';
import { UserRole } from './schemas/user-role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRolesService extends BaseService<UserRole> {
  constructor(
    @InjectModel(UserRole.name) private readonly userRoleModel: Model<UserRole>,
  ) {
    super(userRoleModel, UserRole.name);
  }
}
