// jwt-auth.guard.ts
import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const path = `${request.method} ${request.url}`

    this.logger.log(`[JWT Guard] → canActivate called for ${path}`)

    // Проверяем метку @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    this.logger.debug(`[JWT Guard] Is public endpoint? → ${isPublic}`)

    if (isPublic) {
      this.logger.log(`[JWT Guard] Public endpoint → skipping JWT check`)
      return true
    }

    // Логируем наличие и формат токена
    const authHeader = request.headers.authorization
    if (!authHeader) {
      this.logger.warn(`[JWT Guard] No Authorization header for ${path}`)
    } else {
      const tokenPreview = authHeader.length > 20
        ? authHeader.substring(0, 20) + '...'
        : authHeader
      this.logger.debug(`[JWT Guard] Authorization header found: ${tokenPreview}`)
    }

    const result = super.canActivate(context)

    // Если это Observable или Promise — логируем асинхронный вызов
    if (result instanceof Promise) {
      this.logger.debug(`[JWT Guard] super.canActivate returned Promise`)
    } else if (result instanceof Observable) {
      this.logger.debug(`[JWT Guard] super.canActivate returned Observable`)
    } else {
      this.logger.debug(`[JWT Guard] super.canActivate returned sync boolean: ${result}`)
    }

    return result
  }

  handleRequest(err: any, user: any, info: any, context?: ExecutionContext) {
    const request = context?.switchToHttp().getRequest()
    const path = request ? `${request.method} ${request.url}` : 'unknown'

    if (err) {
      this.logger.error(`[JWT Guard] handleRequest → error: ${err.message || err}`, err?.stack)
      throw err
    }

    if (!user) {
      this.logger.warn(`[JWT Guard] handleRequest → no user | info:`, {
        infoMessage: info?.message,
        infoName: info?.name,
        path,
      })
      throw new UnauthorizedException('Invalid or missing token')
    }

    this.logger.log(`[JWT Guard] handleRequest → success | user id: ${user.id || user.sub || 'no-id'}`)
    // Можно добавить больше полей, если нужно:
    // this.logger.debug('User payload:', user);

    return user
  }
}