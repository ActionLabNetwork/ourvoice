import { ModuleMetadata, FactoryProvider } from '@nestjs/common';

export const ConfigInjectionToken = 'CONFIG_OPTIONS';

export type ContactFormModuleConfig = {
  recaptchaSecret: string;
  smtpSettings: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
};

export type ContactFormModuleAsyncConfig = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<ContactFormModuleConfig>, 'useFactory' | 'inject'>;
