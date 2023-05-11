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
};

export type AuthModuleAsyncConfig = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<AuthModuleConfig>, 'useFactory' | 'inject'>;
