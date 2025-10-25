import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/services/base.service';
import { Company } from './schemas/company.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CompaniesService extends BaseService<Company> {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
  ) {
    super(companyModel, Company.name);
  }
}
