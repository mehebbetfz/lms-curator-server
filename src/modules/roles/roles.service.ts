import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/core/services/base.service';
import { Role } from './schemas/role.schema';

@Injectable()
export class RolesService extends BaseService<Role> {
    constructor(
      @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    ) {
      super(roleModel, Role.name); 
    }
  }