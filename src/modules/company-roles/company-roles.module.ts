import { Module } from '@nestjs/common';
import { CompanyRolesController } from './company-roles.controller';
import { CompanyRolesService } from './company-roles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyRole, CompanyRoleSchema } from './schemas/company-role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CompanyRole.name, schema: CompanyRoleSchema }]),
  ],
  controllers: [CompanyRolesController],
  providers: [CompanyRolesService],
  exports: [CompanyRolesService],
})
export class CompanyRolesModule {}
