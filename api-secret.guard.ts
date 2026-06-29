import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiSecretGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const secretHeader = request.headers['x-api-secret-key'];
        const expectedSecret = process.env.INTERNAL_API_SECRET;

        // Allowing development without secret if not set (to match dev environment behavior, but strictly enforce if set)
        if (expectedSecret && secretHeader !== expectedSecret) {
            throw new UnauthorizedException('Acesso direto não permitido. Utilize o frontend oficial.');
        }

        return true;
    }
}
