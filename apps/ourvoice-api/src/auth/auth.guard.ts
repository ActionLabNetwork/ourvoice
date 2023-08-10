import {
  CanActivate,
  ContextType,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';

import { verifySession } from 'supertokens-node/recipe/session/framework/express';
import { VerifySessionOptions } from 'supertokens-node/recipe/session';
import { GqlExecutionContext } from '@nestjs/graphql';
import { getRequest, getResponse } from '../utils/executionContext';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly verifyOptions?: VerifySessionOptions) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let err = undefined;
    const req = getRequest(context);
    const resp = getResponse(context);

    await verifySession(this.verifyOptions)(req, resp, (res) => {
      err = res;
    });

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
