import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBranchDto } from './dto/create-branch.dto';
import { Branch } from './schemas/branch.schema';

@Injectable()
export class BranchesService {
  public readonly logger = new Logger(Branch.name);
  
  constructor(
    @InjectModel(Branch.name)
    private readonly branchModel: Model<Branch>,
  ) {}
  
  async create(
    userId: string,
    createBranchDto: CreateBranchDto,
  ): Promise<Branch> {
    const branch = new this.branchModel({
      ...createBranchDto,
    });
    
    try {
      return await branch.save();
    } catch (error) {
      this.logger.error(`Не удалось создать модель: ${error}`);
      throw new InternalServerErrorException('FAILED_TO_CREATE_BRANCH');
    }
  }
}
