import { Module } from '@nestjs/common';
import { AuthoritiesService } from './authorities.service';
import { AuthoritiesController } from './authorities.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Authority, AuthoritySchema } from './schemas/authority.schema';
import {
  CheckAuthorityService
} from '../core/services/check-authority.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Authority.name, schema: AuthoritySchema }]),
  ],
  providers: [AuthoritiesService, CheckAuthorityService],
  controllers: [AuthoritiesController],
  exports: [AuthoritiesService],
})
export class AuthoritiesModule {}
