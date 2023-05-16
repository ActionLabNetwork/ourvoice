export type ContactFormModuleConfig = {
  recaptchaSecret: string;
  smtpSettings: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
};
export const ConfigInjectionToken = 'CONFIG_OPTIONS';
