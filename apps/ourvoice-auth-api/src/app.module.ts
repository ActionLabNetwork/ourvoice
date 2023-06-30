import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { AuthOptions } from './auth/config.interface';

import deployment from './config/deployment';
import configuration from './config/configuration';
// import environment from './config/deployment';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [deployment, configuration],
      isGlobal: true,
    }),
    AuthModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          connectionURI: configService.get<string>('supertokens.connectionURI'),
          apiKey: configService.get<string>('supertokens.apiKey'),
          // Learn more about this on https://supertokens.com/docs/emailpassword/appinfo
          appInfo: {
            appName: configService.get<string>('supertokens.appName'),
            apiDomain: configService.get<string>('supertokens.apiDomain'),
            apiBasePath: configService.get<string>('supertokens.apiBasePath'),
            websiteDomain: configService.get<string>(
              'supertokens.websiteDomain',
            ),
            websiteBasePath: configService.get<string>(
              'supertokens.websiteBasePath',
            ),
          },
          smtpSettings: {
            host: configService.get<string>('smtp.host'),
            port: configService.get<number>('smtp.port'),
            user: configService.get<string>('smtp.user'),
            password: configService.get<string>('smtp.password'),
          },
          authModules: configService.get<AuthOptions[]>('authModules'),
          cookieDomain: configService.get<string>('supertokens.cookieDomain'),
          adminEmail: configService.get<string>('supertokens.adminEmail'),
          authBypassTest: {
            isTestMode: configService.get<boolean>('TEST_MODE'),
            createCode: {
              preAuthSessionId: configService.get<string>('preAuthSessionId'),
              codeId: configService.get<string>('codeId'),
              deviceId: configService.get<string>('deviceId'),
              userInputCode: configService.get<string>('userInputCode'),
              linkCode: configService.get<string>('linkCode'),
            },
            consumeCode: {
              email: configService.get<string>('userEmail'),
              id: configService.get<string>('userId'),
              timeJoined: configService.get<number>('userTimeJoined'),
            },
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
