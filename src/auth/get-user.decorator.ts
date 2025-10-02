import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "./jwt.strategy";

export const GetUser = createParamDecorator((data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const user = request.user;

  if (data) {
    return user[data];
  }
  return user;
});
