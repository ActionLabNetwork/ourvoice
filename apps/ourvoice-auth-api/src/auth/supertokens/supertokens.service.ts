import { Logger, Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailVerification from 'supertokens-node/recipe/emailverification';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Passwordless from 'supertokens-node/recipe/passwordless';
import { SMTPService } from 'supertokens-node/recipe/passwordless/emaildelivery';
import { SMTPService as EmailVerificationSMTPService } from 'supertokens-node/recipe/emailverification/emaildelivery';

import {
  ConfigInjectionToken,
  AuthModuleConfig,
  SuperTokenAuthBypass,
} from '../config.interface';
import Dashboard from 'supertokens-node/recipe/dashboard';
import UserMetadata from 'supertokens-node/recipe/usermetadata';
import UserRoles from 'supertokens-node/recipe/userroles';

import { addRoleToUser } from '../roles.service';
import { isEmailAllowed, isModeratorAllowed } from '../metadata.service';

@Injectable()
export class SupertokensService {
  private readonly logger = new Logger('SupertokensService');

  constructor(@Inject(ConfigInjectionToken) private config: AuthModuleConfig) {
    // get configured login options
    const recipes = this.getAuthModules(config);
    supertokens.init({
      appInfo: config.appInfo,
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      recipeList: [
        ...recipes,
        UserMetadata.init(),
        UserRoles.init(),
        Session.init({
          cookieDomain: config.cookieDomain,
          override: {
            functions: (originalImplementation) => {
              return {
                ...originalImplementation,
                createNewSession: async function (input) {
                  const userId = input.userId;
                  const { metadata } = await UserMetadata.getUserMetadata(
                    userId,
                  );
                  // This goes in the access token, and is available to read on the frontend.
                  input.accessTokenPayload = {
                    ...input.accessTokenPayload,
                    deployment: metadata.deployment || '',
                    consent: metadata.consent || '',
                  };

                  return originalImplementation.createNewSession(input);
                },
              };
            },
          },
        }),
      ],
    });
  }

  private getAuthModules(config: AuthModuleConfig) {
    const isTestMode = String(config.authBypassTest.isTestMode) == 'true';
    const smtpSettings = config.smtpSettings;

    const recipeList = {
      EmailPassword: EmailPassword.init({
        signUpFeature: {
          formFields: [
            {
              id: 'deployment',
            },
            {
              id: 'email',
              validate: async (email: string) => {
                // TODO: this should eventually come from admin database
                if (
                  !(await isModeratorAllowed(email)) &&
                  // check if this is app super admin who is login in
                  config.adminEmail !== email
                ) {
                  return 'Sign up disabled. Please contact the admin.';
                } else {
                  return undefined;
                }
              },
            },
          ],
        },
        override: {
          apis: (originalImplementation) => {
            return {
              ...originalImplementation,
              signUpPOST: async function (input) {
                if (originalImplementation.signUpPOST === undefined) {
                  throw Error('Should never come here');
                }

                // First we call the original implementation of signUpPOST.
                const response = await originalImplementation.signUpPOST(input);

                // Post sign up response, we check if it was successful
                if (response.status === 'OK') {
                  const id = response.user.id;
                  // add `user` role to all registered users
                  addRoleToUser(id, 'user');
                  // add deployment
                  const deployment = input.formFields.filter((obj) => {
                    return obj.id === 'deployment';
                  });
                  await UserMetadata.updateUserMetadata(id, {
                    deployment: deployment[0].value || '',
                  });
                }
                return response;
              },
            };
          },
        },
      }),
      Verify: EmailVerification.init({
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
        override: {
          apis: (originalImplementation) => {
            return {
              ...originalImplementation,
              verifyEmailPOST: async function (input) {
                if (originalImplementation.verifyEmailPOST === undefined) {
                  throw Error('Should never come here');
                }
                // First we call the original implementation
                const response = await originalImplementation.verifyEmailPOST(
                  input,
                );

                // Then we check if it was successfully completed
                if (response.status === 'OK') {
                  const { id } = response.user;
                  const { metadata } = await UserMetadata.getUserMetadata(id);
                  // add
                  const sessionHandles =
                    await Session.getAllSessionHandlesForUser(id);
                  sessionHandles.forEach(async (handle) => {
                    const currSessionInfo = await Session.getSessionInformation(
                      handle,
                    );
                    if (currSessionInfo === undefined) {
                      return;
                    }

                    await Session.mergeIntoAccessTokenPayload(handle, {
                      deployment: metadata.deployment || '',
                    });
                  });
                }
                return response;
              },
            };
          },
        },
      }),
      Passwordless: Passwordless.init({
        contactMethod: 'EMAIL',
        flowType: 'MAGIC_LINK',
        emailDelivery: isTestMode
          ? {
              override: (originalImplementation) => {
                return {
                  ...originalImplementation,
                  sendEmail: async function () {
                    // Do nothing as we don't want to send emails in test mode
                  },
                };
              },
            }
          : {
              service: new SMTPService({
                smtpSettings: {
                  host: smtpSettings.host,
                  authUsername: smtpSettings.user,
                  password: smtpSettings.password,
                  port: config.smtpSettings.port || 2525,
                  from: {
                    name: 'OurVoice',
                    // TODO: make configurable
                    email: 'no-reply@ourvoice.app',
                  },
                  // secure: true,
                },
              }),
            },
        override: {
          functions: (originalImplementation) => {
            return {
              ...originalImplementation,

              // here we are only overriding the function that's responsible
              // for signing in / up a user.
              createCode: async function (input) {
                // TODO: create custom code generation logic
                // or call the default behaviour as show below
                // See steps:
                // 1) https://github.com/supertokens/supertokens-node/blob/master/lib/ts/recipe/passwordless/api/createCode.ts
                // 2) https://github.com/supertokens/supertokens-core/blob/master/src/main/java/io/supertokens/webserver/api/passwordless/CreateCodeAPI.java
                // 3) https://github.com/supertokens/supertokens-core/blob/master/src/main/java/io/supertokens/passwordless/Passwordless.java#L62
                const {
                  preAuthSessionId,
                  codeId,
                  deviceId,
                  userInputCode,
                  linkCode,
                } = config.authBypassTest.createCode;
                const code: SuperTokenAuthBypass['createCode'] = isTestMode
                  ? {
                      status: 'OK',
                      preAuthSessionId,
                      codeId,
                      deviceId,
                      userInputCode,
                      linkCode,
                      timeCreated: Date.now(),
                      codeLifetime: 900000,
                    }
                  : await originalImplementation.createCode(input);

                return code;
              },
              consumeCode: async function (input) {
                // TODO: create custom code consumption logic
                // or call the default behaviour as show below
                // See steps:
                // 1) https://github.com/supertokens/supertokens-node/blob/master/lib/ts/recipe/passwordless/api/consumeCode.ts
                // 2) https://github.com/supertokens/supertokens-core/blob/master/src/main/java/io/supertokens/webserver/api/passwordless/ConsumeCodeAPI.java
                // 3) https://github.com/supertokens/supertokens-core/blob/master/src/main/java/io/supertokens/passwordless/Passwordless.java#L165
                const { email, id, timeJoined } =
                  config.authBypassTest.consumeCode;
                const testResponse: SuperTokenAuthBypass['consumeCode'] = {
                  status: 'OK',
                  createdNewUser: false,
                  user: {
                    email,
                    id,
                    timeJoined,
                  },
                };
                const response = await originalImplementation.consumeCode(
                  input,
                );

                return isTestMode ? testResponse : response;
              },
            };
          },
          apis: (originalImplementation) => {
            return {
              ...originalImplementation,
              createCodePOST: async function (input) {
                if ('email' in input) {
                  const existingUser = await Passwordless.getUserByEmail({
                    email: input.email,
                  });
                  if (existingUser === undefined) {
                    // this is sign up attempt
                    if (!(await isEmailAllowed(input.email))) {
                      return {
                        status: 'GENERAL_ERROR',
                        message: 'Sign up disabled. Please contact the admin.',
                      };
                    }
                  }
                }
                return await originalImplementation.createCodePOST?.(input);
              },
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
                  // const { id, email, phoneNumber } = response.user;
                  if (response.createdNewUser) {
                    let deployment = '';
                    const request = supertokens.getRequestFromUserContext(
                      input.userContext,
                    );

                    if (request !== undefined) {
                      deployment = request.getHeaderValue('deployment');
                    } else {
                      /**
                       * This is possible if the function is triggered from the user management dashboard
                       *
                       * In this case set a reasonable default value to use
                       */
                      deployment = '';
                    }

                    // add `user` role to all registered users
                    addRoleToUser(response.user.id, 'user');

                    // add deployment to user metadata
                    await UserMetadata.updateUserMetadata(response.user.id, {
                      deployment,
                    });
                    const sessionHandles =
                      await Session.getAllSessionHandlesForUser(
                        response.user.id,
                      );

                    // we update all the session's Access Token payloads for this user
                    sessionHandles.forEach(async (handle) => {
                      const currSessionInfo =
                        await Session.getSessionInformation(handle);
                      if (currSessionInfo === undefined) {
                        return;
                      }

                      await Session.mergeIntoAccessTokenPayload(handle, {
                        deployment,
                      });
                    });
                  }
                }
                return response;
              },
            };
          },
        },
      }),
      Dashboard: Dashboard.init({
        apiKey: config.apiKey || 'super-secret-api-key',
      }),
    };
    return config.authModules
      ? config.authModules.map((auth) => recipeList[auth])
      : Object.values(recipeList);
  }
}
