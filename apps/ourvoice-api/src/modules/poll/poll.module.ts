import { PrismaModule as MainPrismaModule } from '../../database/main/prisma.module';
import { PrismaModule as ModerationPrismaModule } from '../../database/moderation/prisma.module';
import { PollRepository } from './poll.repository';
import { PollService } from './poll.service';
import { PollResolver } from './poll.resolver';
import { Module } from '@nestjs/common';
import { PollModerationRepository } from './poll-moderation.repository';
import { AnalyticsModule } from 'src/analytics/analytics.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SMTPConfig } from 'src/auth/config.interface';

@Module({
  imports: [
    MainPrismaModule,
    ModerationPrismaModule,
    AuthModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          connectionURI: configService.get<string>('supertokens.connectionURI'),
          apiKey: configService.get<string>('supertokens.apiKey'),
          appInfo: {
            // Learn more about this on https://supertokens.com/docs/emailpassword/appinfo
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
          smtpSettings: configService.get<SMTPConfig>('smtp'),
          cookieDomain: configService.get<string>('supertokens.cookieDomain'),
          globalPepper: configService.get<string>('api.globalPepper'),
          deployment: configService.get<string>('deployment')
        };
      },
    }),
    AnalyticsModule,
  ],
  providers: [
    PollRepository,
    PollModerationRepository,
    PollService,
    PollResolver,
  ],
})
export class PollModule {}
