import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  public readonly logger = new Logger(User.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(userId: string, createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      phone: createUserDto.phone.toLowerCase(),
    });

    if (existingUser) {
      throw new ConflictException('USER_WITH_THIS_PHONE_ALREADY_EXISTS');
    }

    const user = new this.userModel({
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
    });

    try {
      return await user.save();
    } catch (error) {
      this.logger.error(`Не удалось создать модель: ${error}`);
      throw new InternalServerErrorException('FAILED_TO_CREATE_USER');
    }
  }
}
