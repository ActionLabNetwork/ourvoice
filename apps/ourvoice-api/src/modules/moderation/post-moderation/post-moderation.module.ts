import { AuthModule } from '../../../auth/auth.module';
import { PostModule } from '../../post/post.module';
import { Module } from '@nestjs/common';
import { PrismaModule as MainPrismaModule } from 'src/database/main/prisma.module';
import { PrismaModule as ModerationPrismaModule } from 'src/database/moderation/prisma.module';
import { PostModerationRepository } from './post-moderation.repository';
import { PostModerationResolver } from './post-moderation.resolver';
import { PostModerationService } from './post-moderation.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SMTPConfig } from 'src/auth/config.interface';

@Module({
  imports: [
    MainPrismaModule,
    ModerationPrismaModule,
    PostModule,
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
        };
      },
    }),
  ],
  providers: [
    PostModerationRepository,
    PostModerationService,
    PostModerationResolver,
  ],
  exports: [PostModerationService, PostModerationRepository],
})
export class PostModerationModule {}
