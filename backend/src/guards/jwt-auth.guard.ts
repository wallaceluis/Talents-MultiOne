import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Log apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      const request = context.switchToHttp().getRequest();
      this.logger.debug(`Route: ${request.method} ${request.url}`);
    }

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
