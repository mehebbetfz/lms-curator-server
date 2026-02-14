import {
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { randomBytes, scryptSync } from 'crypto'
import mongoose, { Model, Types } from 'mongoose'
import { UserRoleStatus } from '../../core/enums/user-role-status.enum'
import { UserStatus } from '../../core/enums/user-status.enum'
import { HierarchyContext } from '../../core/interfaces/hierarchy-context.interface'
import { UserCompanyRole } from '../user-company-roles/schemas/user-company-role.schema'
import { User } from '../users/schemas/user.schema'
import { UserBranchesReqDto } from './dto/user-branches-req.dto'
import {
  UserCompaniesReqDto,
} from './dto/user-companies-req.dto'
import { UserCoursesReqDto } from './dto/user-courses-req.dto'
import { ContextualAuthority } from './interfaces/contextual-authority.interface'
import { TokenPayload } from './interfaces/token-payload.interface'
import { AuthToken } from './schemas/auth-token.schema'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(AuthToken.name) private authTokenModel: Model<AuthToken>,
    @InjectModel(UserCompanyRole.name)
    private userCompanyRoleModel: Model<UserCompanyRole>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userModel
      .findOne({ username })
      .select('+password')
      .exec()

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Разбираем хеш из формата "salt.hexHash"
    const passwordParts = user.password.split('.')

    if (passwordParts.length !== 2) {
      throw new UnauthorizedException('Invalid password format')
    }

    const [salt, storedHash] = passwordParts

    // Генерируем хеш для введенного пароля с тем же salt
    const hash = scryptSync(password, salt, 32) as Buffer
    const inputHash = hash.toString('hex')

    // Сравниваем хеши (защита от timing attacks)
    const isPasswordValid = this.compareHashesTimingSafe(inputHash, storedHash)

    console.log('Password validation result:', isPasswordValid)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active')
    }

    return user
  }

  // Защита от timing attacks
  private compareHashesTimingSafe(hash1: string, hash2: string): boolean {
    if (hash1.length !== hash2.length) {
      return false
    }

    let result = 0
    for (let i = 0; i < hash1.length; i++) {
      result |= hash1.charCodeAt(i) ^ hash2.charCodeAt(i)
    }

    return result === 0
  }

  async login(
    username: string,
    password: string,
    userAgent?: string,
    ipAddress?: string,
    context?: HierarchyContext,
  ): Promise<any> {

    const user = await this.validateUser(username, password)
    const tokens = await this.generateTokens(user, userAgent, ipAddress, {})

    return {
      ...tokens,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      context: {},
    }
  }

  async refreshToken(refreshToken: string): Promise<any> {
    const tokenDoc = await this.authTokenModel
      .findOne({ refreshToken, revoked: false })
      .populate('userId')
      .exec()

    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const user = tokenDoc.userId as unknown as User

    const tokens = await this.generateTokens(user)

    tokenDoc.revoked = true
    await tokenDoc.save()

    return {
      ...tokens,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    }
  }

  async logout(refreshToken: string): Promise<void> {
    await this.authTokenModel
      .updateOne({ refreshToken }, { revoked: true })
      .exec()
  }

  async logoutAll(userId: string): Promise<void> {
    await this.authTokenModel
      .updateMany(
        { userId: new Types.ObjectId(userId), revoked: false },
        { revoked: true },
      )
      .exec()
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
    }

    const accessToken = this.jwtService.sign(payload)
    const refreshToken = this.generateRefreshToken()

    const expiresIn = this.configService.get<number>('JWT_EXPIRES_IN', 60)
    const refreshTokenExpires = new Date()
    refreshTokenExpires.setDate(
      refreshTokenExpires.getDate() +
      this.configService.get<number>('REFRESH_TOKEN_EXPIRES_DAYS', 7),
    )

    await this.authTokenModel.create({
      userId: user._id,
      refreshToken,
      expiresAt: refreshTokenExpires,
      userAgent,
      ipAddress,
    })

    return {
      accessToken,
      refreshToken,
      expiresIn,
    }
  }

  private generateRefreshToken(): string {
    return randomBytes(64).toString('base64url')
  }

  async getUserAuthorities(
    userId: string,
    context?: HierarchyContext,
  ): Promise<ContextualAuthority[]> {
    // Базовые условия фильтрации
    const matchStage: any = {
      'userCompanyRoles.user_id': new Types.ObjectId(userId),
      'userCompanyRoles.status': 'ACTIVE', // если есть поле статуса
    }


    if (context?.courseId) {
      matchStage['userCompanyRoles.course_id'] = new Types.ObjectId(context.courseId)
    }
    if (context?.branchId) {
      matchStage['userCompanyRoles.branch_id'] = new Types.ObjectId(context.branchId)
    }

    const authorities = await this.userModel.aggregate([
      // Шаг 1: Находим пользователя
      { $match: { _id: new Types.ObjectId(userId) } },

      // Шаг 2: Соединяем с user_company_roles
      {
        $lookup: {
          from: 'usercompanyroles',
          localField: '_id',
          foreignField: 'user_id',
          as: 'userCompanyRoles',
        },
      },
      { $unwind: '$userCompanyRoles' },

      // Шаг 3: Фильтруем по контексту и статусу
      { $match: matchStage },

      // Шаг 4: Соединяем с company_roles
      {
        $lookup: {
          from: 'companyroles',
          localField: 'userCompanyRoles.company_role_id',
          foreignField: '_id',
          as: 'companyRole',
        },
      },
      { $unwind: '$companyRole' },

      // Шаг 5: Соединяем с companyroleauthorities
      {
        $lookup: {
          from: 'companyroleauthorities',
          localField: 'companyRole._id',
          foreignField: 'company_role_id',
          as: 'companyRoleAuthorities',
        },
      },
      { $unwind: '$companyRoleAuthorities' },

      // Шаг 6: Соединяем с authorities
      {
        $lookup: {
          from: 'authorities',
          localField: 'companyRoleAuthorities.authority_id',
          foreignField: '_id',
          as: 'authority',
        },
      },
      { $unwind: '$authority' },

      // Шаг 7: Формируем результат
      {
        $project: {
          authority: '$authority.name',
          context: {
            companyId: '$userCompanyRoles.company_id',
            courseId: '$userCompanyRoles.course_id',
            branchId: '$userCompanyRoles.branch_id',
            companyRoleId: '$userCompanyRoles.company_role_id',
          },
        },
      },

      // Шаг 8: Убираем дубликаты
      {
        $group: {
          _id: {
            authority: '$authority',
            companyId: '$context.companyId',
            courseId: '$context.courseId',
            branchId: '$context.branchId',
          },
          context: { $first: '$context' }
        }
      },

      // Шаг 9: Форматируем результат
      {
        $project: {
          _id: 0,
          authority: '$_id.authority',
          context: 1
        }
      }
    ])

    return authorities
  }

  async hasAuthority(
    userId: string,
    authority: string,
    context?: HierarchyContext,
  ): Promise<boolean> {
    const authorities = await this.getUserAuthorities(userId, context)
    return authorities.some((auth) => auth.authority === authority)
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec()
    if (!user) {
      throw new UnauthorizedException('User not found')
    }
    return user
  }

  async validateUserContext(
    userId: string,
    context: HierarchyContext,
  ): Promise<boolean> {
    try {
      console.log('Validating user context:', { userId, context })

      const pipeline: any[] = [
        // 1. Находим активные роли пользователя
        {
          $match: {
            user_id: new Types.ObjectId(userId),
            status: UserRoleStatus.ACTIVE
          }
        },

        // 2. Join с companyroles чтобы получить company_id и другие данные
        {
          $lookup: {
            from: 'companyroles',
            localField: 'company_role_id',
            foreignField: '_id',
            as: 'companyRole',
          },
        },
        { $unwind: { path: '$companyRole', preserveNullAndEmptyArrays: true } },

        // 3. Фильтруем по company_id если указан
        ...(context.companyId ? [{
          $match: {
            'companyRole.company_id': new Types.ObjectId(context.companyId)
          }
        }] : []),

        // 4. Join с branches если нужно проверить branch_id
        ...(context.branchId ? [
          {
            $lookup: {
              from: 'branches',
              localField: 'branch_id',
              foreignField: '_id',
              as: 'branch',
            },
          },
          { $unwind: { path: '$branch', preserveNullAndEmptyArrays: true } },
          {
            $match: {
              'branch._id': new Types.ObjectId(context.branchId)
            }
          }
        ] : []),

        // 5. Join с courses если нужно проверить course_id
        ...(context.courseId ? [
          {
            $lookup: {
              from: 'courses',
              localField: 'course_id',
              foreignField: '_id',
              as: 'course',
            },
          },
          { $unwind: { path: '$course', preserveNullAndEmptyArrays: true } },
          {
            $match: {
              'course._id': new Types.ObjectId(context.courseId)
            }
          }
        ] : []),

        // 6. Проверяем наличие хотя бы одной подходящей роли
        { $limit: 1 },
        {
          $project: {
            hasAccess: { $literal: 1 },
          },
        }
      ]

      const result = await this.userCompanyRoleModel.aggregate(pipeline).exec()
      console.log('Validation result:', result)

      return result.length > 0

    } catch (error) {
      console.error('Error validating user context:', error)
      return false
    }
  }

  async getUsersCompanies(userId: string): Promise<UserCompaniesReqDto[]> {
    const objectId = new mongoose.Types.ObjectId(userId)

    return this.userCompanyRoleModel.aggregate([
      { $match: { user_id: objectId } },
      {
        $lookup: {
          from: 'companyroles',
          localField: 'company_role_id',
          foreignField: '_id',
          as: 'companyRole',
        },
      },
      { $unwind: '$companyRole' },
      {
        $lookup: {
          from: 'companies',
          localField: 'companyRole.company_id',
          foreignField: '_id',
          as: 'company',
        },
      },
      { $unwind: '$company' },
      {
        $group: {
          _id: '$company._id',
          name: { $first: '$company.name' },
          createdAt: { $first: '$company.createdAt' },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          createdAt: 1,
        },
      },
      { $sort: { name: 1 } },
    ])
  }

  async getUsersCourses(userId: string): Promise<UserCoursesReqDto[]> {
    const objectId = new mongoose.Types.ObjectId(userId)

    return this.userCompanyRoleModel.aggregate([
      { $match: { user_id: objectId, status: 'ACTIVE' } },

      // Достаем конкретный курс по course_id
      {
        $lookup: {
          from: 'courses',
          localField: 'course_id',
          foreignField: '_id',
          as: 'course',
        },
      },
      { $unwind: '$course' },

      {
        $group: {
          _id: '$course._id',
          name: { $first: '$course.name' },
          companyId: { $first: '$course.company_id' },
        },
      },

      { $sort: { name: 1 } },
    ])
  }


  async getUsersBranches(userId: string): Promise<UserBranchesReqDto[]> {
    const objectId = new mongoose.Types.ObjectId(userId)

    return this.userCompanyRoleModel.aggregate([
      { $match: { user_id: objectId, status: 'ACTIVE' } },

      // Достаем branch_id напрямую
      {
        $lookup: {
          from: 'branches',
          localField: 'branch_id',
          foreignField: '_id',
          as: 'branch',
        },
      },
      { $unwind: '$branch' },

      // Достаем курс к которому принадлежит branch
      {
        $lookup: {
          from: 'courses',
          localField: 'branch.course_id',
          foreignField: '_id',
          as: 'course',
        },
      },
      { $unwind: '$course' },

      {
        $group: {
          _id: '$branch._id',
          name: { $first: '$branch.name' },
          description: { $first: '$branch.description' },
          companyId: { $first: '$course.company_id' },
          courseId: { $first: '$course._id' },
          courseName: { $first: '$course.name' },
        },
      },

      { $sort: { name: 1 } },
    ])
  }

}
