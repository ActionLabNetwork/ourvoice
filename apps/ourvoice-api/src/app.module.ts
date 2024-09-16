import { join } from 'node:path'

import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ScheduleModule } from '@nestjs/schedule'
import { GraphQLError } from 'graphql/error'

import { AnalyticsModule } from './analytics/analytics.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { SMTPConfig } from './auth/config.interface'
import configuration from './config/configuration'
import deployment from './config/deployment'
import { DateTimeScalar } from './graphql/DatetimeScalar'
import { CategoryModule } from './modules/category/category.module'
import { CommentModule } from './modules/comment/comment.module'
import { ContactFormModule } from './modules/contactform/contactform.module'
import { ModerationModule } from './modules/moderation/moderation.module'
import { PollModule } from './modules/poll/poll.module'
import { PostModule } from './modules/post/post.module'
import { UsersModule } from './modules/users/users.module'
import { VoteModule } from './modules/vote/vote.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [deployment, configuration],
      isGlobal: true,
    }),
    AnalyticsModule,
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
          deployment: configService.get<string>('deployment'),
        }
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault(),
        ApolloServerPluginCacheControl(),
      ],
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
      formatError: (error: GraphQLError) => {
        const { extensions, message } = error
        const { originalError } = extensions
        return {
          message,
          originalError,
        }
      },
    }),
    PostModule,
    CategoryModule,
    CommentModule,
    ContactFormModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          smtpSettings: {
            host: configService.get<string>('smtp.host'),
            port: configService.get<number>('smtp.port'),
            user: configService.get<string>('smtp.user'),
            pass: configService.get<string>('smtp.password'),
          },
          recaptchaSecret: configService.get<string>('contact.recaptchaSecret'),
        }
      },
    }),
    VoteModule,
    PollModule,
    VoteModule,
    ModerationModule,
    ScheduleModule.forRoot(),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, DateTimeScalar],
})
export class AppModule {}
