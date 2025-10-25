import {
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../../core/services/base.service';
import { Branch } from './schemas/branch.schema';

@Injectable()
export class BranchesService extends BaseService<Branch> {
  constructor(
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>,
  ) {
    super(branchModel, Branch.name);
  }
}
