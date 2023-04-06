import { Logger, Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';

import { ConfigInjectionToken, AuthModuleConfig } from '../config.interface';
import UserMetadata from 'supertokens-node/recipe/usermetadata';
import UserRoles from 'supertokens-node/recipe/userroles';

@Injectable()
export class SupertokensService {
  private readonly logger = new Logger('SupertokensService');

  constructor(@Inject(ConfigInjectionToken) private config: AuthModuleConfig) {
    supertokens.init({
      appInfo: config.appInfo,
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      recipeList: [
        Session.init({
          cookieDomain: `${
            process.env.SUPERTOKENS_COOKIE_DOMAIN || '.localhost'
          }`,
        }),
        UserMetadata.init(),
        UserRoles.init(),
      ],
    });
  }
}
