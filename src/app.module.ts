import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { CoreModule } from './core/modules/core.module';
import { UsersModule } from './modules/users/users.module';
import { AuthoritiesModule } from './modules/authorities/authorities.module';
import {
  AuthorityCategoriesModule
} from './modules/authority-categories/authority-categories.module';

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
            console.log('✅ Connected to external MongoDB ');
          });
          connection.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error);
          });
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthoritiesModule,
    AuthorityCategoriesModule,
    CoreModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
