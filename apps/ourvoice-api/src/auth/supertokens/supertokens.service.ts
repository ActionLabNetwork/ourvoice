import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Passwordless from 'supertokens-node/recipe/passwordless';
import { SMTPService } from 'supertokens-node/recipe/passwordless/emaildelivery';

import { ConfigInjectionToken, AuthModuleConfig } from '../config.interface';
import Dashboard from 'supertokens-node/recipe/dashboard';

@Injectable()
export class SupertokensService {
  constructor(@Inject(ConfigInjectionToken) private config: AuthModuleConfig) {
    supertokens.init({
      appInfo: config.appInfo,
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      recipeList: [
        EmailPassword.init(),
        Session.init(),
        Passwordless.init({
          contactMethod: 'EMAIL',
          flowType: 'MAGIC_LINK',
          emailDelivery: {
            service: new SMTPService({
              smtpSettings: {
                host: 'sandbox.smtp.mailtrap.io',
                authUsername: '45b6fe1a310740',
                password: 'b650a5745ae26b',
                port: 2525,
                from: {
                  name: 'OurVoice',
                  email: 'no-reply@ourvoice.app',
                },
                // secure: true,
              },
            }),
          },
        }),
        Dashboard.init({
          apiKey: config.apiKey || '',
        }),
      ],
    });
  }
}
