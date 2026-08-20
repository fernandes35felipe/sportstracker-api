import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { AuditService } from './audit.service';

const SENSITIVE_RESOURCES = ['/me', '/export', '/profile', '/provision'];
const WRITE_METHODS = ['POST', 'PATCH', 'PUT', 'DELETE'];

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const { method, url, user } = req;
    const ip: string = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ?? req.ip;
    const userAgent: string = req.headers['user-agent'] ?? '';
    const resource = url.split('?')[0];

    const shouldLog =
      WRITE_METHODS.includes(method) ||
      SENSITIVE_RESOURCES.some((r) => resource.includes(r));

    if (!shouldLog) return next.handle();

    return next.handle().pipe(
      tap(() => {
        this.auditService.log({
          userId: user?.userId ?? user?.sub,
          action: method,
          resource,
          ip,
          userAgent,
          statusCode: context.switchToHttp().getResponse().statusCode,
        });
      }),
      catchError((err) => {
        this.auditService.log({
          userId: user?.userId ?? user?.sub,
          action: method,
          resource,
          ip,
          userAgent,
          statusCode: err.status ?? 500,
          metadata: { error: err.message },
        });
        return throwError(() => err);
      }),
    );
  }
}
