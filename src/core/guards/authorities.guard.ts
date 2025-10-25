import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as process from 'node:process';
import { CheckAuthorityService } from '../services/check-authority.service';

@Injectable()
export class AuthoritiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private checkAuthorityService: CheckAuthorityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredAuthorities = this.reflector.get<string[]>(
      'authorities',
      context.getHandler(),
    );
    if (!requiredAuthorities) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    if (process.env.NODE_ENV === 'development') {
      return true;
    }

    return await this.checkAuthorityService.check(user.userId, requiredAuthorities);
  }
}
