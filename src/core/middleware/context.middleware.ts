import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Устанавливаем контекст в request для использования в guards
    req['context'] = {
      companyId: req.headers['x-company-id'] || req.query.companyId,
      courseId: req.headers['x-course-id'] || req.query.courseId,
      branchId: req.headers['x-branch-id'] || req.query.branchId,
    };
    next();
  }
}
