import { Module } from '@nestjs/common';
import { AuthoritiesService } from './authorities.service';
import { AuthoritiesController } from './authorities.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Authority, AuthoritySchema } from './schemas/authority.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Authority.name, schema: AuthoritySchema }]),
  ],
  providers: [AuthoritiesService],
  controllers: [AuthoritiesController],
  exports: [AuthoritiesService],
})
export class AuthoritiesModule {}
