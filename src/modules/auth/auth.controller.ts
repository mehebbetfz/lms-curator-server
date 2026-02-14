import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Ip,
  Post, Req,
  UseGuards,
} from '@nestjs/common'
import { Public } from '../../core/decorators/public.decorator'
import { JwtAuthGuard } from '../../core/guards/auth.guard'
import { AuthService } from './auth.service'
import { AuthResponse } from './dto/auth-response.dto'
import { LoginDto } from './dto/login.dto'
import { LogoutDto } from './dto/logout.dto'
import { ProfileResponse } from './dto/profile-response.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'

@Controller('auth')
@UseGuards()
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ipAddress: string,
  ): Promise<AuthResponse> {
    try {

      console.log("Login attempt:", {
        username: loginDto.username,
        userAgent,
        ipAddress,
      })
      return await this.authService.login(
        loginDto.username,
        loginDto.password,
        userAgent,
        ipAddress,
      )
    } catch (error) {
      if (error.message.includes('hierarchy')) {
        throw new BadRequestException(error.message)
      }
      throw error
    }
  }

  @Public()
  @Post('refresh')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponse> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken)
  }

  @Public()
  @Post('logout')
  async logout(
    @Body() logoutDto: LogoutDto,
    @Req() request: Request,
  ): Promise<void> {
    const refreshToken = logoutDto.refreshToken || this.extractRefreshTokenFromHeader(request)

    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required')
    }

    await this.authService.logout(refreshToken)
  }

  @Post('logout-all')
  async logoutAll(@Req() request: any): Promise<void> {
    await this.authService.logoutAll(request.user.id)
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
    }

    const authorities = await this.authService.getUserAuthorities(
      request.user.id,
      context,
    )
    console.log(authorities)

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
    }
  }

  @Get('contexts')
  @UseGuards(JwtAuthGuard)
  async getAvailableContexts(@Req() req: any) {
    const [companies, courses, branches] = await Promise.all([
      this.authService.getUsersCompanies(req.user.id),
      this.authService.getUsersCourses(req.user.id),
      this.authService.getUsersBranches(req.user.id),
    ])

    return {
      companies,
      courses,
      branches,
    }
  }

  @Post('select-context')
  @UseGuards(JwtAuthGuard)
  async selectContext(
    @Req() req: any,
    @Body() context: {
      companyId: string
      courseId?: string
      branchId?: string
    },
    @Headers('user-agent') userAgent: string,
    @Ip() ipAddress: string,
  ): Promise<AuthResponse> {
    // Проверяем доступ пользователя к этому контексту
    const hasAccess = await this.authService.validateUserContext(
      req.user.id,
      context,
    )

    if (!hasAccess) {
      throw new BadRequestException('User does not have access to this context')
    }

    // Генерируем новые токены с выбранным контекстом
    const user = await this.authService.findUserById(req.user.id)
    const tokens = await this.authService.generateTokens(
      user,
      userAgent,
      ipAddress,
      context,
    )

    console.log(context)


    // Получаем authorities для выбранного контекста
    const authorities = await this.authService.getUserAuthorities(
      user._id.toString(),
      context,
    )

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
      authorities: authorities.map(auth => auth.authority),
    }
  }

  @Post('switch-context')
  async switchContext(
    @Req() request: any,
    @Body() context: {
      companyId?: string
      courseId?: string
      branchId?: string
    },
    @Headers('user-agent') userAgent: string,
    @Ip() ipAddress: string,
  ): Promise<AuthResponse> {
    const hasAccess = await this.authService.validateUserContext(
      request.user.id,
      context,
    )

    if (!hasAccess) {
      throw new BadRequestException('User does not have access to this context')
    }

    const user = await this.authService.findUserById(request.user.id)
    const tokens = await this.authService.generateTokens(
      user,
      userAgent,
      ipAddress,
      context,
    )


    const authorities = await this.authService.getUserAuthorities(
      request.user.id,
      context,
    )

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
      authorities: authorities.map(auth => auth.authority),
    }
  }

  private extractRefreshTokenFromHeader(request: Request): string | null {
    // Правильный способ получения заголовка
    const authHeader = request.headers.get('authorization')
    if (!authHeader) return null

    const [type, token] = authHeader.split(' ')
    return type === 'Refresh' ? token : null
  }
}
