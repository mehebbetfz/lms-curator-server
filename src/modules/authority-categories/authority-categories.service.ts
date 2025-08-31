import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateAuthorityCategoryDto
} from './dto/create-authority-category.dto';
import { AuthorityCategory } from './schemas/authority-category.schema';

@Injectable()
export class AuthorityCategoriesService {
  public readonly logger = new Logger(AuthorityCategory.name);
  
  constructor(
    @InjectModel(AuthorityCategory.name)
    private readonly authorityCategoryModel: Model<AuthorityCategory>,
  ) {}
  
  async create(
    userId: string,
    createAuthorityCategoryDto: CreateAuthorityCategoryDto,
  ): Promise<AuthorityCategory> {
    const authorityCategory = new this.authorityCategoryModel({
      ...createAuthorityCategoryDto,
    });
    
    try {
      return await authorityCategory.save();
    } catch (error) {
      this.logger.error(`Не удалось создать модель: ${error}`);
      throw new InternalServerErrorException('FAILED_TO_CREATE_AUTHORITY_CATEGORY');
    }
  }
}
