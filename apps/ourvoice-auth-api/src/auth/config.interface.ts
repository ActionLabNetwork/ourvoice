import { ModuleMetadata, FactoryProvider } from '@nestjs/common';
import { AppInfo } from 'supertokens-node/types';

export const ConfigInjectionToken = 'ConfigInjectionToken';

type SMTPConfig = {
  host: string;
  user: string;
  password: string;
  port: number;
};

export type AuthOptions =
  | 'EmailPassword'
  | 'Passwordless'
  | 'Verify'
  | 'Dashboard';

export type AuthModuleConfig = {
  appInfo: AppInfo;
  connectionURI: string;
  smtpSettings: SMTPConfig;
  apiKey?: string;
  cookieDomain?: string;
  authModules?: AuthOptions[];
  authBypassTest: {
    isTestMode: boolean;
    createCode: {
      preAuthSessionId: string;
      codeId: string;
      deviceId: string;
      userInputCode: string;
      linkCode: string;
    };
    consumeCode: {
      id: string;
      email: string;
      timeJoined: number;
    };
  };
};

export type AuthModuleAsyncConfig = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<AuthModuleConfig>, 'useFactory' | 'inject'>;

export type SuperTokenAuthBypass = {
  createCode: {
    status: 'OK';
    preAuthSessionId: string;
    codeId: string;
    deviceId: string;
    userInputCode: string;
    linkCode: string;
    timeCreated: number;
    codeLifetime: number;
  };
  consumeCode: {
    status: 'OK';
    createdNewUser: boolean;
    user: {
      email?: string;
      id: string;
      timeJoined: number;
    };
  };
};
