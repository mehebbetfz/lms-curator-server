import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Authority } from './schemas/authority.schema';
import { CreateAuthorityDto } from './dto/create-authority.dto';

@Injectable()
export class AuthoritiesService {
  public readonly logger = new Logger(Authority.name);

  constructor(
    @InjectModel(Authority.name)
    private readonly authorityModel: Model<Authority>,
  ) {}

  async create(
    userId: string,
    createAuthorityDto: CreateAuthorityDto,
  ): Promise<Authority> {
    const authority = new this.authorityModel({
      ...createAuthorityDto,
    });

    try {
      return await authority.save();
    } catch (error) {
      this.logger.error(`Не удалось создать модель: ${error}`);
      throw new InternalServerErrorException('FAILED_TO_CREATE_AUTHORITY');
    }
  }
}
