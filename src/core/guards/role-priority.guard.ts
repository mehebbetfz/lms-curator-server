import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { CompanyRolesService } from '../../modules/company-roles/company-roles.service'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator' // ✅ импорт метки публичности

@Injectable()
export class RolePriorityGuard implements CanActivate {
  private readonly logger = new Logger(RolePriorityGuard.name);

  constructor(
    private reflector: Reflector,
    private companyRolesService: CompanyRolesService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const path = `${request.method} ${request.url}`

    // 1️⃣ Пропускаем публичные эндпоинты — они не требуют пользователя
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      this.logger.log(`[RolePriorityGuard] Public endpoint → skipping guard`)
      return true
    }

    // Далее — только для защищённых маршрутов
    const user = request.user

    this.logger.log(`[RolePriorityGuard] → canActivate called for ${path}`)

    // 2. Проверяем наличие пользователя и ролей
    if (!user) {
      this.logger.warn(
        `[RolePriorityGuard] No user found in request → throwing Forbidden`,
      )
      throw new ForbiddenException('User not authenticated')
    }

    if (!user.roles || !user.roles.maxPriority) {
      this.logger.warn(
        `[RolePriorityGuard] User has no roles or maxPriority → throwing Forbidden`,
        {
          userId: user.id || user.sub || 'unknown',
          roles: user.roles,
        },
      )
      throw new ForbiddenException('User roles information not found')
    }

    this.logger.debug(`[RolePriorityGuard] User authenticated`, {
      userId: user.id || user.sub || 'unknown',
      maxPriority: user.roles.maxPriority,
      rolesCount: user.roles?.length || 0,
    })

    // 3. Для GET-запросов — просто добавляем максимальный приоритет в request
    if (request.method === 'GET') {
      request.userMaxPriority = user.roles.maxPriority
      this.logger.debug(
        `[RolePriorityGuard] GET request → attached userMaxPriority = ${user.roles.maxPriority}`,
      )
    }

    // 4. Для POST / PATCH — проверяем приоритет роли, которую пытаются создать/изменить
    if (request.method === 'POST' || request.method === 'PATCH') {
      this.logger.log(
        `[RolePriorityGuard] Checking role modification priority for ${path}`,
      )
      await this.validateRolePriorityForModification(request, user)
    }

    this.logger.log(`[RolePriorityGuard] → Access granted for ${path}`)
    return true
  }

  private async validateRolePriorityForModification(
    request: any,
    user: any,
  ): Promise<void> {
    const maxUserPriority = user.roles.maxPriority
    const path = `${request.method} ${request.url}`

    // Проверяем, если в body есть поле priority (создание или обновление роли)
    if (request.body.priority !== undefined) {
      this.logger.debug(
        `[RolePriorityGuard] New role priority = ${request.body.priority}, user max = ${maxUserPriority}`,
      )

      if (request.body.priority <= maxUserPriority) {
        this.logger.warn(
          `[RolePriorityGuard] Attempt to assign low/equal priority role → forbidden`,
          {
            attemptedPriority: request.body.priority,
            userMaxPriority: maxUserPriority,
            path,
          },
        )
        throw new ForbiddenException(
          'Cannot assign role with priority equal to or lower than your current roles',
        )
      }

      this.logger.debug(`[RolePriorityGuard] Priority check passed for new role`)
    }

    // Если это обновление существующей роли (PATCH /roles/:id)
    if (request.params?.id) {
      try {
        const existingRole = await this.companyRolesService.findById(
          request.params.id,
        )

        if (!existingRole) {
          this.logger.warn(
            `[RolePriorityGuard] Role not found for update`,
            { roleId: request.params.id },
          )
          throw new ForbiddenException('Role not found')
        }

        this.logger.debug(
          `[RolePriorityGuard] Existing role priority = ${existingRole.priority}`,
        )

        if (existingRole.priority <= maxUserPriority) {
          this.logger.warn(
            `[RolePriorityGuard] Attempt to modify protected role → forbidden`,
            {
              roleId: request.params.id,
              rolePriority: existingRole.priority,
              userMaxPriority: maxUserPriority,
            },
          )
          throw new ForbiddenException(
            'Cannot modify role with priority equal to or lower than your current roles',
          )
        }

        this.logger.debug(
          `[RolePriorityGuard] Existing role modification allowed`,
        )
      } catch (err) {
        this.logger.error(
          `[RolePriorityGuard] Error while fetching existing role`,
          err?.stack,
        )
        throw err // пробрасываем дальше (например, если 404)
      }
    }
  }
}