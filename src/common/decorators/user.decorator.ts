import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export type IUser = DecodedIdToken;

export const User = createParamDecorator<DecodedIdToken>(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
