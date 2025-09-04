import { Injectable, UnauthorizedException, Logger, BadRequestException } from '@nestjs/common';
import { TokenPayload } from './interfaces/token-payload.interface';
import { User } from '../users/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { AuthToken } from './schemas/auth-token.schema';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { ContextualAuthority } from './interfaces/contextual-authority.interface';
import * as bcrypt from 'bcrypt';
import { UserStatus } from '../../core/enums/user-status.enum';
import {
  HierarchyContext
} from '../../core/interfaces/hierarchy-context.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(AuthToken.name) private authTokenModel: Model<AuthToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userModel
      .findOne({ email: email.toLowerCase() })
      .select('+password')
      .exec();
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }
    
    return user;
  }
  
  async login(
    email: string,
    password: string,
    userAgent?: string,
    ipAddress?: string,
    context?: HierarchyContext,
  ): Promise<any> {
    const user = await this.validateUser(email, password);
    
    const tokens = await this.generateTokens(user, userAgent, ipAddress, context);
    
    return {
      ...tokens,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      context,
    };
  }
  
  async refreshToken(refreshToken: string): Promise<any> {
    const tokenDoc = await this.authTokenModel
      .findOne({ refreshToken, revoked: false })
      .populate('userId')
      .exec();
    
    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    
    const user = tokenDoc.userId as unknown as User;
    
    const tokens = await this.generateTokens(user);
    
    tokenDoc.revoked = true;
    await tokenDoc.save();
    
    return {
      ...tokens,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
  
  async logout(refreshToken: string): Promise<void> {
    await this.authTokenModel.updateOne(
      { refreshToken },
      { revoked: true },
    ).exec();
  }
  
  async logoutAll(userId: string): Promise<void> {
    await this.authTokenModel.updateMany(
      { userId: new Types.ObjectId(userId), revoked: false },
      { revoked: true },
    ).exec();
  }
  
  async generateTokens(
    user: User,
    userAgent?: string,
    ipAddress?: string,
    context?: HierarchyContext,
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    const payload: TokenPayload = {
      sub: user._id.toString(),
      username: user.username,
      email: user.email,
      currentContext: context,
    };
    
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.generateRefreshToken();
    
    const expiresIn = this.configService.get<number>('JWT_EXPIRES_IN', 3600);
    const refreshTokenExpires = new Date();
    refreshTokenExpires.setDate(
      refreshTokenExpires.getDate() +
      this.configService.get<number>('REFRESH_TOKEN_EXPIRES_DAYS', 7),
    );
    
    await this.authTokenModel.create({
      userId: user._id,
      refreshToken,
      expiresAt: refreshTokenExpires,
      userAgent,
      ipAddress,
    });
    
    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }
  
  private generateRefreshToken(): string {
    return randomBytes(64).toString('base64url');
  }
  
  async getUserAuthorities(
    userId: string,
    context?: HierarchyContext,
  ): Promise<ContextualAuthority[]> {
    const matchStage: any = {
      'userRoles.user_id': new Types.ObjectId(userId),
      'userRoles.status': 'active'
    };
    
    if (context?.companyId) {
      matchStage['userRoles.company_id'] = new Types.ObjectId(context.companyId);
    }
    if (context?.courseId) {
      matchStage['userRoles.course_id'] = new Types.ObjectId(context.courseId);
    }
    if (context?.branchId) {
      matchStage['userRoles.branch_id'] = new Types.ObjectId(context.branchId);
    }
    
    const authorities = await this.userModel.aggregate([
      { $match: { _id: new Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'userroles',
          localField: '_id',
          foreignField: 'user_id',
          as: 'userRoles',
        },
      },
      { $unwind: '$userRoles' },
      { $match: matchStage },
      {
        $lookup: {
          from: 'roleauthorities',
          localField: 'userRoles.role_id',
          foreignField: 'role_id',
          as: 'roleAuthorities',
        },
      },
      { $unwind: '$roleAuthorities' },
      {
        $lookup: {
          from: 'authorities',
          localField: 'roleAuthorities.authority_id',
          foreignField: '_id',
          as: 'authority',
        },
      },
      { $unwind: '$authority' },
      {
        $project: {
          authority: '$authority.name',
          context: {
            companyId: '$userRoles.company_id',
            courseId: '$userRoles.course_id',
            branchId: '$userRoles.branch_id',
          },
        },
      },
    ]);
    
    return authorities;
  }
  
  async hasAuthority(
    userId: string,
    authority: string,
    context?: HierarchyContext,
  ): Promise<boolean> {
    const authorities = await this.getUserAuthorities(userId, context);
    return authorities.some(auth => auth.authority === authority);
  }
  
  async findUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
  
  async validateUserContext(
    userId: string,
    context: HierarchyContext,
  ): Promise<boolean> {
    try {
      // Проверяем что пользователь имеет хотя бы одну роль в этом контексте
      const userRoles = await this.userModel.aggregate([
        { $match: { _id: new Types.ObjectId(userId) } },
        {
          $lookup: {
            from: 'userroles',
            localField: '_id',
            foreignField: 'user_id',
            as: 'userRoles',
          },
        },
        { $unwind: '$userRoles' },
        { $match: { 'userRoles.status': 'active' } },
      ]);
      
      return userRoles.some(role => {
        if (context.branchId && role.userRoles.branch_id) {
          return role.userRoles.branch_id.toString() === context.branchId;
        }
        if (context.courseId && role.userRoles.course_id) {
          return role.userRoles.course_id.toString() === context.courseId;
        }
        if (context.companyId && role.userRoles.company_id) {
          return role.userRoles.company_id.toString() === context.companyId;
        }
        return false;
      });
    } catch (error) {
      return false;
    }
  }
  
  async getUsersCompanies(userId: string): Promise<any[]> {
    // Реализация получения компаний пользователя
    return [];
  }
  
  async getUsersCourses(userId: string): Promise<any[]> {
    // Реализация получения курсов пользователя
    return [];
  }
  
  async getUsersBranches(userId: string): Promise<any[]> {
    // Реализация получения филиалов пользователя
    return [];
  }
}
