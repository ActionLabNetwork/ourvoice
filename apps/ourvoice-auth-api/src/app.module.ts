import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { AuthOptions } from './auth/config.interface';

import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    // INJECT CONFIG - https://wanago.io/2022/08/15/api-with-nestjs-dynamic-modules/
    // AuthModule.forRoot({
    //   connectionURI: `${process.env.SUPERTOKENS_URI}`,
    //   apiKey: `${process.env.SUPERTOKENS_API_KEY}`,
    //   appInfo: {
    //     // Learn more about this on https://supertokens.com/docs/emailpassword/appinfo
    //     appName: `${process.env.SUPERTOKENS_APP_NAME}` || 'Ourvoice Auth API',
    //     apiDomain:
    //       `${process.env.SUPERTOKENS_API_DOMAIN}` || 'http://localhost:3001',
    //     apiBasePath: `${process.env.SUPERTOKENS_API_BASE_PATH}` || '/auth',
    //     websiteDomain:
    //       `${process.env.SUPERTOKENS_WEBSITE_DOMAIN}` ||
    //       'http://localhost:3030',
    //     websiteBasePath: `${process.env.SUPERTOKENS_WEBSITE_BASE_PATH}` || '/',
    //   },
    //   smtpSettings: {
    //     host: `${process.env.SMTP_HOST}`,
    //     port: Number(process.env.SMTP_PORT),
    //     user: `${process.env.SMTP_USER}`,
    //     password: `${process.env.SMTP_PASSWORD}`,
    //   },
    // }),
    AuthModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connectionURI:
          configService.get<string>('SUPERTOKENS_URI') ||
          'http://localhost:3567',
        apiKey:
          configService.get<string>('SUPERTOKENS_API_KEY') ||
          'super-secret-api-key',
        // Learn more about this on https://supertokens.com/docs/emailpassword/appinfo
        appInfo: {
          appName:
            configService.get<string>('SUPERTOKENS_APP_NAME') ||
            'Ourvoice Auth API',
          apiDomain:
            configService.get<string>('SUPERTOKENS_API_DOMAIN') ||
            'http://localhost:3001',
          apiBasePath:
            configService.get<string>('SUPERTOKENS_API_BASE_PATH') || '/auth',
          websiteDomain:
            configService.get<string>('SUPERTOKENS_WEBSITE_DOMAIN') ||
            'http://localhost:3030',
          websiteBasePath:
            configService.get<string>('SUPERTOKENS_WEBSITE_BASE_PATH') || '/',
        },
        smtpSettings: {
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT'),
          user: configService.get<string>('SMTP_USER'),
          password: configService.get<string>('SMTP_PASSWORD'),
        },
        authModules: configService.get<AuthOptions[]>('auth'),
        cookieDomain:
          configService.get<string>('SUPERTOKENS_COOKIE_DOMAIN') ||
          '.localhost',
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
