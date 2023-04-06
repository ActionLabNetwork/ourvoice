import { Logger, Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailVerification from 'supertokens-node/recipe/emailverification';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Passwordless from 'supertokens-node/recipe/passwordless';
import { SMTPService } from 'supertokens-node/recipe/passwordless/emaildelivery';
import { SMTPService as EmailVerificationSMTPService } from 'supertokens-node/recipe/emailverification/emaildelivery';

import { ConfigInjectionToken, AuthModuleConfig } from '../config.interface';
import Dashboard from 'supertokens-node/recipe/dashboard';
import UserMetadata from 'supertokens-node/recipe/usermetadata';
import UserRoles from 'supertokens-node/recipe/userroles';

import { addRoleToUser } from '../roles.service';

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
        EmailPassword.init({
          override: {
            apis: (originalImplementation) => {
              return {
                ...originalImplementation,
                signUpPOST: async function (input) {
                  if (originalImplementation.signUpPOST === undefined) {
                    throw Error('Should never come here');
                  }

                  // First we call the original implementation of signUpPOST.
                  const response = await originalImplementation.signUpPOST(
                    input,
                  );

                  // Post sign up response, we check if it was successful
                  if (response.status === 'OK') {
                    const id = response.user.id;
                    // add `user` role to all registered users
                    addRoleToUser(id);
                  }
                  return response;
                },
              };
            },
          },
        }),
        EmailVerification.init({
          mode: 'REQUIRED', // or "OPTIONAL"
          emailDelivery: {
            service: new EmailVerificationSMTPService({
              smtpSettings: {
                host: config.smtpSettings.host,
                authUsername: config.smtpSettings.user,
                password: config.smtpSettings.password,
                port: config.smtpSettings.port || 2525,
                from: {
                  name: 'OurVoice',
                  email: 'no-reply@ourvoice.app',
                },
                // secure: true,
              },
            }),
          },
        }),
        Session.init({
          cookieDomain: `${
            process.env.SUPERTOKENS_COOKIE_DOMAIN || '.localhost'
          }`,
        }),
        Passwordless.init({
          contactMethod: 'EMAIL',
          flowType: 'MAGIC_LINK',
          emailDelivery: {
            service: new SMTPService({
              smtpSettings: {
                host: config.smtpSettings.host,
                authUsername: config.smtpSettings.user,
                password: config.smtpSettings.password,
                port: config.smtpSettings.port || 2525,
                from: {
                  name: 'OurVoice',
                  email: 'no-reply@ourvoice.app',
                },
                // secure: true,
              },
            }),
          },
          override: {
            apis: (originalImplementation) => {
              return {
                ...originalImplementation,
                consumeCodePOST: async (input) => {
                  if (originalImplementation.consumeCodePOST === undefined) {
                    throw Error('Should never come here');
                  }
                  // First we call the original implementation of consumeCodePOST.
                  const response = await originalImplementation.consumeCodePOST(
                    input,
                  );

                  // Post sign up response, we check if it was successful
                  if (response.status === 'OK') {
                    const { id, email, phoneNumber } = response.user;
                    if (response.createdNewUser) {
                      // add `user` role to all registered users
                      addRoleToUser(id);
                    }
                  }
                  return response;
                },
              };
            },
          },
        }),
        Dashboard.init({
          apiKey: config.apiKey || '',
        }),
        UserMetadata.init(),
        UserRoles.init(),
      ],
    });
  }
}
