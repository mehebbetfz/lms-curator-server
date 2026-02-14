import { Module } from '@nestjs/common';
import { CompanyRolesController } from './company-roles.controller';
import { CompanyRolesService } from './company-roles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyRole, CompanyRoleSchema } from './schemas/company-role.schema';
import { RolePriorityGuard } from '../../core/guards/role-priority.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../../core/guards/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CompanyRole.name,
        schema: CompanyRoleSchema,
      },
    ]),
  ],
  controllers: [CompanyRolesController],
  providers: [
    CompanyRolesService,
  ],
  exports: [CompanyRolesService, MongooseModule],
})
export class CompanyRolesModule {}
