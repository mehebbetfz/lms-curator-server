// contextual-authorities.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../../modules/auth/auth.service';

export interface ContextualAuthorityRequirement {
  authority: string;
  contextKey?: string; // 'companyId', 'courseId', 'branchId' etc.
}

@Injectable()
export class ContextualAuthoritiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredAuthorities = this.reflector.get<ContextualAuthorityRequirement[]>(
      'contextualAuthorities',
      context.getHandler(),
    );
    
    if (!requiredAuthorities) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }
    
    // Извлекаем контекст из запроса
    const contextFromRequest = this.extractContext(request);
    
    for (const requirement of requiredAuthorities) {
      let contextForCheck = { ...contextFromRequest };
      
      // Если указан конкретный contextKey, используем только его
      if (requirement.contextKey && contextFromRequest[requirement.contextKey]) {
        contextForCheck = {
          [requirement.contextKey]: contextFromRequest[requirement.contextKey],
        };
      }
      
      const hasAuthority = await this.authService.hasAuthority(
        user.id,
        requirement.authority,
        contextForCheck,
      );
      
      if (!hasAuthority) {
        throw new ForbiddenException(
          `Required authority: ${requirement.authority} in context ${JSON.stringify(contextForCheck)}`,
        );
      }
    }
    
    return true;
  }
  
  private extractContext(request: any): {
    companyId?: string;
    courseId?: string;
    branchId?: string;
  } {
    // Извлекаем контекст из различных источников
    return {
      companyId: request.headers['x-company-id'] || request.query.companyId || request.body.companyId,
      courseId: request.headers['x-course-id'] || request.query.courseId || request.body.courseId,
      branchId: request.headers['x-branch-id'] || request.query.branchId || request.body.branchId,
    };
  }
}
