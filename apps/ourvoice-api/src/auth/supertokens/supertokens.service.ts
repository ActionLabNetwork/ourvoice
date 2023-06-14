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
          cookieDomain: `${process.env.SUPERTOKENS_COOKIE_DOMAIN}`,
          override: {
            functions: (originalImplementation) => {
              return {
                ...originalImplementation,
                createNewSession: async function (input) {
                  const request = supertokens.getRequestFromUserContext(
                    input.userContext,
                  );
                  const userId = input.userId;
                  const { metadata } = await UserMetadata.getUserMetadata(
                    userId,
                  );
                  // This goes in the access token, and is available to read on the frontend.
                  input.accessTokenPayload = {
                    ...input.accessTokenPayload,
                    deployment: metadata.deployment || '',
                  };
                  return originalImplementation.createNewSession(input);
                },
              };
            },
          },
        }),
        UserMetadata.init(),
        UserRoles.init(),
      ],
    });
  }
}
