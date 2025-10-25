// role-priority.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  CompanyRolesService
} from '../../modules/company-roles/company-roles.service';

@Injectable()
export class RolePriorityGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private companyRolesService: CompanyRolesService,
  ) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user || !user.roles) {
      throw new ForbiddenException('User roles information not found');
    }
    
    // Для операций чтения применяем фильтрацию по приоритету
    if (request.method === 'GET') {
      // Добавляем информацию о максимальном приоритете пользователя в запрос
      request.userMaxPriority = user.roles.maxPriority;
    }
    
    // Для операций создания/обновления проверяем, что пользователь не назначает роли с высоким приоритетом
    if (request.method === 'POST' || request.method === 'PATCH') {
      await this.validateRolePriorityForModification(request, user);
    }
    
    return true;
  }
  
  private async validateRolePriorityForModification(request: any, user: any): Promise<void> {
    const maxUserPriority = user.roles.maxPriority;
    
    if (request.body.priority !== undefined) {
      if (request.body.priority <= maxUserPriority) {
        throw new ForbiddenException('Cannot assign role with priority equal to or lower than your current roles');
      }
    }
    
    // Если обновляется существующая роль, проверяем её текущий приоритет
    if (request.params.id) {
      const existingRole = await this.companyRolesService.findById(request.params.id);
      if (existingRole.priority <= maxUserPriority) {
        throw new ForbiddenException('Cannot modify role with priority equal to or lower than your current roles');
      }
    }
  }
}
