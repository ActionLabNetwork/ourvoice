import { PrismaModule } from 'src/database/moderation/prisma.module';
import { Module } from '@nestjs/common';
import { CommentModerationResolver } from './ comment-moderation.resolver';
import { CommentModerationRepository } from './comment-moderation.repository';
import { CommentModerationService } from './comment-moderation.service';
import { CommentModule } from 'src/modules/comment/comment.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { SMTPConfig } from 'src/auth/config.interface';

@Module({
  imports: [
    PrismaModule,
    CommentModule,
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
  ],
  providers: [
    CommentModerationRepository,
    CommentModerationService,
    CommentModerationResolver,
  ],
  exports: [CommentModerationService, CommentModerationRepository],
})
export class CommentModerationModule {}
