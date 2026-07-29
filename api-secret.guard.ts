import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiSecretGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();

        // Always allow OPTIONS preflight so CORS middleware can respond correctly
        if (request.method === 'OPTIONS') return true;

        const secretHeader = request.headers['x-api-secret-key'];
        const expectedSecret = process.env.INTERNAL_API_SECRET;

        if (expectedSecret && secretHeader !== expectedSecret) {
            throw new UnauthorizedException('Acesso direto não permitido. Utilize o frontend oficial.');
        }

        return true;
    }
}
