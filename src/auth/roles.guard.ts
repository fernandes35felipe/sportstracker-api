import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Obtém as permissões (roles) exigidas pela rota
    const requiredRoles = this.reflector.getAllAndOverride<string[]>("roles", [context.getHandler(), context.getClass()]);

    if (!requiredRoles) {
      return true; // Se nenhuma permissão for exigida, permite o acesso
    }

    // 2. Obtém o usuário (com o role) a partir do request (injetado pelo JwtAuthGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user; // { userId, email, role }

    if (!user || !user.role) {
      throw new ForbiddenException("User role not found in authentication token");
    }

    // 3. Verifica se o role do usuário está na lista de requiredRoles
    const hasPermission = requiredRoles.some((role) => role === user.role);

    if (!hasPermission) {
      throw new ForbiddenException(`Access denied. Required role: ${requiredRoles.join(" or ")}`);
    }

    return hasPermission;
  }
}
