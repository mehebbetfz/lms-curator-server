import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { AuthoritiesGuard } from '../core/guards/authorities.guard';
import {
  CheckAuthorityService
} from '../core/services/check-authority.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, CheckAuthorityService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
