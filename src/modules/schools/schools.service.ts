import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { School } from './schemas/school.schema';
import { CreateSchoolDto } from './dto/create-school.dto';

@Injectable()
export class SchoolsService {
  public readonly logger = new Logger(School.name);
  
  constructor(
    @InjectModel(School.name)
    private readonly schoolModel: Model<School>,
  ) {}
  
  async create(
    userId: string,
    createSchoolDto: CreateSchoolDto,
  ): Promise<School> {
    const school = new this.schoolModel({
      ...createSchoolDto,
    });
    
    try {
      return await school.save();
    } catch (error) {
      this.logger.error(`Не удалось создать модель: ${error}`);
      throw new InternalServerErrorException('FAILED_TO_CREATE_SCHOOL');
    }
  }
}
