import {
  CanActivate,
  ContextType,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Error as STError } from 'supertokens-node';

import { verifySession } from 'supertokens-node/recipe/session/framework/express';
import { VerifySessionOptions } from 'supertokens-node/recipe/session';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly verifyOptions?: VerifySessionOptions) {}

  getRequest(context: ExecutionContext) {
    if (context.getType<ContextType | 'graphql'>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext().req;
    }
    return context.switchToHttp().getRequest();
  }

  getResponse(context: ExecutionContext) {
    if (context.getType<ContextType | 'graphql'>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext().res;
    }
    return context.switchToHttp().getResponse();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let err = undefined;
    const resp = this.getResponse(context);

    await verifySession(this.verifyOptions)(
      this.getRequest(context),
      resp,
      (res) => {
        err = res;
      },
    );

    // if (resp.headersSent) {
    //   throw new STError({
    //     message: 'RESPONSE_SENT',
    //     type: 'RESPONSE_SENT',
    //   });
    // }

    if (err) {
      return false;
    }

    return true;
  }
}
