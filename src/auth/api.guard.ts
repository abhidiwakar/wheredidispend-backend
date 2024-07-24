import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class APIGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const superUserKey = this.configService.getOrThrow('SUPER_USER_API_KEY');
    const request = context.switchToHttp().getRequest();
    const token = this.extractAPIKeyFromHeader(request);
    if (!token || token !== superUserKey) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractAPIKeyFromHeader(request: Request): string | undefined {
    const apiKey = request.headers['x-api-key'];
    return apiKey as string | undefined;
  }
}
