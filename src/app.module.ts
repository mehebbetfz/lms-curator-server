import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthController } from './controllers/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { AuthoritySchema } from './models/authority.model';
import { AuthorityController } from './controllers/authority.controller';
import { CarSchema } from './models/car.model';

const dynamicModels = [
  {
    name: 'Authority',
    schema: AuthoritySchema,
  },
  { name: 'Car', schema: CarSchema },
];
const dynamicControllers = [AuthorityController];

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
    MongooseModule.forFeature(dynamicModels),
  ],
  controllers: [AppController, HealthController, ...dynamicControllers],
  providers: [AppService],
})
export class AppModule {}
