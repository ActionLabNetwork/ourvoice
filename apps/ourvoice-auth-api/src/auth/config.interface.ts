import { AppInfo } from 'supertokens-node/types';

export const ConfigInjectionToken = 'ConfigInjectionToken';

export type SMTPConfig = {
  host: string;
  user: string;
  password: string;
  port: number;
};
export type AuthModuleConfig = {
  appInfo: AppInfo;
  connectionURI: string;
  smtpSettings: SMTPConfig;
  apiKey?: string;
};