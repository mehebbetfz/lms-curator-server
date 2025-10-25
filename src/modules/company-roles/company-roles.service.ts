import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BaseService } from '../../core/services/base.service';
import { CompanyRole } from './schemas/company-role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, FilterQuery, Model } from 'mongoose';
import {
  CompanyRolesForCompanyResDto,
} from './dto/company-roles-for-company-res.dto';
import { CreateCompanyRoleDto } from './dto/create-company-role.dto';
import { Context } from '../../core/dto/context.dto';

@Injectable()
export class CompanyRolesService extends BaseService<CompanyRole> {
  constructor(
    @InjectModel(CompanyRole.name) private readonly companyRoleModel: Model<CompanyRole>,
  ) {
    super(companyRoleModel, CompanyRole.name);
  }
}
