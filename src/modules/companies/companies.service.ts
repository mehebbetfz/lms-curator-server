import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './schemas/company.schema';

@Injectable()
export class CompaniesService {
  public readonly logger = new Logger(Company.name);

  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<Company>,
  ) {}

  async create(
    userId: string,
    createCompanyDto: CreateCompanyDto,
  ): Promise<Company> {
    const company = new this.companyModel({
      ...createCompanyDto,
    });

    try {
      return await company.save();
    } catch (error) {
      this.logger.error(`Не удалось создать модель: ${error}`);
      throw new InternalServerErrorException('FAILED_TO_CREATE_COMPANY');
    }
  }
}
