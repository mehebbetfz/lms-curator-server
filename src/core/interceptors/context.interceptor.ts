// context.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    // Добавляем контекст к ответу
    return next.handle().pipe(
      map(data => ({
        ...data,
        context: {
          companyId: request.headers['x-company-id'],
          courseId: request.headers['x-course-id'],
          branchId: request.headers['x-branch-id'],
        },
      })),
    );
  }
}
