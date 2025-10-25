import { Module } from '@nestjs/common';
import { CompanyRoleAuthoritiesController } from './company-role-authorities.controller';
import { CompanyRoleAuthoritiesService } from './company-role-authorities.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CompanyRoleAuthority,
  CompanyRoleAuthoritySchema,
} from './schemas/company-role-authority.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CompanyRoleAuthority.name, schema: CompanyRoleAuthoritySchema }]),
  ],
  controllers: [CompanyRoleAuthoritiesController],
  providers: [CompanyRoleAuthoritiesService],
  exports: [CompanyRoleAuthoritiesService, MongooseModule],
})
export class CompanyRoleAuthoritiesModule {}
