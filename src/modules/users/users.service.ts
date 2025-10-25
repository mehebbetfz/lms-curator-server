import {
  ConflictException,
  Injectable, InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, FilterQuery, Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { BaseService } from 'src/core/services/base.service';
import { generateRandomString } from '../../core/utils/password-generator.util';
import { randomBytes, scryptSync } from 'crypto';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    super(userModel, User.name); 
  }
  
  async create(
    createData: Partial<User>,
    uniqueCheckFilter?: FilterQuery<User>,
    session?: ClientSession,
  ): Promise<User> {
    try {
      const genUsername = `${'user_' + generateRandomString(6)}`;
      
      // Генерация соли и хеширование пароля для входа
      const salt = randomBytes(8).toString('hex');
      const hash = scryptSync(createData.password, salt, 32) as Buffer;
      const hashedPassword = salt + '.' + hash.toString('hex');
      
      createData.username = genUsername;
      createData.password = hashedPassword;
      
      // Проверка на уникальность, если передан фильтр
      if (uniqueCheckFilter) {
        uniqueCheckFilter.username = createData.username;
        
        const existing = await this.model
          .findOne(uniqueCheckFilter, null, { session })
          .exec();
        if (existing) {
          throw new ConflictException('RECORD_ALREADY_EXISTS');
        }
      }
      
      const newDocument = new this.model(createData);
      return (await newDocument.save({ session })) as User;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Ошибка при create(): ${error.message}`);
      throw new InternalServerErrorException('Ошибка при create()');
    }
  }
}
