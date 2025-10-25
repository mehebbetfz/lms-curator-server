// jwt.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenPayload } from '../../modules/auth/interfaces/token-payload.interface';
import { UserStatus } from '../enums/user-status.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../modules/users/schemas/user.schema';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { CompanyRole } from '../../modules/company-roles/schemas/company-role.schema';
import {
  UserCompanyRole
} from '../../modules/user-company-roles/schemas/user-company-role.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserCompanyRole.name) private userCompanyRoleModel: Model<UserCompanyRole>,
    @InjectModel(CompanyRole.name) private companyRoleModel: Model<CompanyRole>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }
  
  async validate(payload: TokenPayload) {
    const user = await this.userModel
      .findById(payload.sub)
      .select('-password -encryptedPassword')
      .exec();
    
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User not found or inactive');
    }
    
    // Получаем роли пользователя с их приоритетами
    const userRoles = await this.userCompanyRoleModel
      .find({
        user_id: user._id,
        status: 'ACTIVE'
      })
      .populate('company_role_id')
      .exec();
    
    // Находим максимальный приоритет среди ролей пользователя
    const maxUserPriority = userRoles.length > 0
      ? Math.max(...userRoles.map(role => (role.company_role_id as any).priority))
      : 0;
    
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      currentContext: payload.currentContext || {},
      roles: {
        maxPriority: maxUserPriority,
        userRoles: userRoles.map((role: any) => ({
          roleId: role.company_role_id._id.toString(),
          priority: (role.company_role_id as any).priority
        }))
      }
    };
  }
}
