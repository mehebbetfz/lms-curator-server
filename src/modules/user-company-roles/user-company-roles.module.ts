import { Module } from '@nestjs/common';
import { UserCompanyRolesController } from './user-company-roles.controller';
import { UserCompanyRolesService } from './user-company-roles.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserCompanyRole,
  UserCompanyRoleSchema,
} from './schemas/user-company-role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserCompanyRole.name,
        schema: UserCompanyRoleSchema,
      },
    ]),
  ],
  controllers: [UserCompanyRolesController],
  providers: [UserCompanyRolesService],
  exports: [UserCompanyRolesService, MongooseModule],
})
export class UserCompanyRolesModule {}
