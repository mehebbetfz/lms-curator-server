import {
  BadRequestException,
  Body,
  Controller,
  Ip,
  Headers,
  Post, Req, Get,
} from '@nestjs/common';
import { AuthResponse } from './dto/auth-response.dto';
import { AuthService } from './auth.service';
import { Public } from '../../core/decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { ProfileResponse } from './dto/profile-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @Public()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ipAddress: string,
  ): Promise<AuthResponse> {
    try {
      const context = {
        companyId: loginDto.companyId,
        courseId: loginDto.courseId,
        branchId: loginDto.branchId,
      };
      
      return await this.authService.login(
        loginDto.email,
        loginDto.password,
        userAgent,
        ipAddress,
        context,
      );
    } catch (error) {
      if (error.message.includes('hierarchy')) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
  
  @Public()
  @Post('refresh')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponse> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
  
  @Post('logout')
  async logout(
    @Body() logoutDto: LogoutDto,
    @Req() request: Request,
  ): Promise<void> {
    const refreshToken = logoutDto.refreshToken || this.extractRefreshTokenFromHeader(request);
    
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }
    
    await this.authService.logout(refreshToken);
  }
  
  @Post('logout-all')
  async logoutAll(@Req() request: any): Promise<void> {
    await this.authService.logoutAll(request.user.id);
  }
  
  @Get('profile')
  async getProfile(
    @Req() request: any,
    @Headers('x-company-id') companyId?: string,
    @Headers('x-course-id') courseId?: string,
    @Headers('x-branch-id') branchId?: string,
  ): Promise<ProfileResponse> {
    const context = {
      companyId: companyId || request.query.companyId,
      courseId: courseId || request.query.courseId,
      branchId: branchId || request.query.branchId,
    };
    
    const authorities = await this.authService.getUserAuthorities(
      request.user.id,
      context,
    );
    
    return {
      id: request.user.id,
      username: request.user.username,
      email: request.user.email,
      firstName: request.user.firstName,
      lastName: request.user.lastName,
      middleName: request.user.middleName,
      phone: request.user.phone,
      authorities: authorities.map(auth => auth.authority),
      currentContext: request.user.currentContext || {},
    };
  }
  
  @Get('contexts')
  async getAvailableContexts(@Req() request: any) {
    const [companies, courses, branches] = await Promise.all([
      this.authService.getUsersCompanies(request.user.id),
      this.authService.getUsersCourses(request.user.id),
      this.authService.getUsersBranches(request.user.id),
    ]);
    
    return {
      companies,
      courses,
      branches,
    };
  }
  
  @Post('switch-context')
  async switchContext(
    @Req() request: any,
    @Body() context: {
      companyId?: string;
      courseId?: string;
      branchId?: string;
    },
    @Headers('user-agent') userAgent: string,
    @Ip() ipAddress: string,
  ): Promise<AuthResponse> {
    const hasAccess = await this.authService.validateUserContext(
      request.user.id,
      context,
    );
    
    if (!hasAccess) {
      throw new BadRequestException('User does not have access to this context');
    }
    
    const user = await this.authService.findUserById(request.user.id);
    const tokens = await this.authService.generateTokens(
      user,
      userAgent,
      ipAddress,
      context,
    );
    
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
  
  private extractRefreshTokenFromHeader(request: Request): string | null {
    // Правильный способ получения заголовка
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return null;
    
    const [type, token] = authHeader.split(' ');
    return type === 'Refresh' ? token : null;
  }
}
