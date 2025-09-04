import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AuthToken, AuthTokenSchema } from './schemas/auth-token.schema';
import { JwtStrategy } from '../../core/strategies/jwt.strategy';
import {
  ContextualAuthoritiesGuard
} from '../../core/guards/contextual-authorities.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('JWT_EXPIRES_IN', 3600),
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AuthToken.name, schema: AuthTokenSchema },
    ]),
  ],
  providers: [AuthService, JwtStrategy, ContextualAuthoritiesGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, ContextualAuthoritiesGuard],
})
export class AuthModule {}
