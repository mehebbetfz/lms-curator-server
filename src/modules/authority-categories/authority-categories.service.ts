import {
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthorityCategory } from './schemas/authority-category.schema';
import { BaseService } from '../../core/services/base.service';

@Injectable()
export class AuthorityCategoriesService extends BaseService<AuthorityCategory> {
  constructor(
    @InjectModel(AuthorityCategory.name) private readonly authorityCategoryModel: Model<AuthorityCategory>,
  ) {
    super(authorityCategoryModel, AuthorityCategory.name);
  }
}
