import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { TerminusModule } from '@nestjs/terminus'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { JwtAuthGuard } from './core/guards/auth.guard'
import { CoreModule } from './core/modules/core.module'
import { AuthModule } from './modules/auth/auth.module'
import { AuthoritiesModule } from './modules/authorities/authorities.module'
import { AuthorityCategoriesModule } from './modules/authority-categories/authority-categories.module'
import { BranchesModule } from './modules/branches/branches.module'
import { CompaniesModule } from './modules/companies/companies.module'
import {
  CompanyRoleAuthoritiesModule
} from './modules/company-role-authorities/company-role-authorities.module'
import {
  CompanyRolesModule
} from './modules/company-roles/company-roles.module'
import { CoursesModule } from './modules/courses/courses.module'
import { SchoolsModule } from './modules/schools/schools.module'
import { UserCompanyRolesModule } from './modules/user-company-roles/user-company-roles.module'
import { UsersModule } from './modules/users/users.module'

@Module({
  imports: [
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        retryAttempts: 5,
        retryDelay: 3000,
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log('✅ Connected to external MongoDB ')
          })
          connection.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error)
          })
          return connection
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthoritiesModule,
    AuthorityCategoriesModule,
    CoreModule,
    CompaniesModule,
    SchoolsModule,
    BranchesModule,
    UserCompanyRolesModule,
    AuthModule,
    CoursesModule,
    BranchesModule,
    CompanyRolesModule,
    UserCompanyRolesModule,
    CompanyRoleAuthoritiesModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService,
  ],
})
export class AppModule { }
