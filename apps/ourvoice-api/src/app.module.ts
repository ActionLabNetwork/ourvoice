import { CategoryModule } from './modules/category/category.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import { ContactFormModule } from './modules/contactform/contactform.module';
import { ModerationModule } from './modules/moderation/moderation.module';
import { UsersModule } from './modules/users/users.module';

import deployment from './config/deployment';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [deployment],
      isGlobal: true,
    }),
    AuthModule.forRoot({
      connectionURI: `${
        process.env.SUPERTOKENS_URI || 'http://localhost:3567'
      }`,
      apiKey: `${process.env.SUPERTOKENS_API_KEY || 'super-secret-api-key'}`,
      appInfo: {
        // Learn more about this on https://supertokens.com/docs/emailpassword/appinfo
        appName: `${process.env.SUPERTOKENS_APP_NAME || 'Ourvoice API'}`,
        apiDomain: `${
          process.env.SUPERTOKENS_API_DOMAIN || 'http://authapi.ourvoice.test'
        }`,
        apiBasePath: `${process.env.SUPERTOKENS_API_BASE_PATH || '/auth'}`,
        websiteDomain: `${
          process.env.SUPERTOKENS_WEBSITE_DOMAIN || 'http://auth.ourvoice.test'
        }`,
        websiteBasePath: `${process.env.SUPERTOKENS_WEBSITE_BASE_PATH || '/'}`,
      },
      smtpSettings: {
        host: `${process.env.SMTP_HOST}`,
        port: Number(process.env.SMTP_PORT),
        user: `${process.env.SMTP_USER}`,
        password: `${process.env.SMTP_PASSWORD}`,
      },
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
    }),
    PostModule,
    CategoryModule,
    CommentModule,
    ContactFormModule.register({
      smtpSettings: {
        host: process.env.CONTACT_FORM_SMTP_HOST,
        port: Number(process.env.CONTACT_FORM_SMTP_PORT),
        user: process.env.CONTACT_FORM_SMTP_USER,
        pass: process.env.CONTACT_FORM_SMTP_PASS,
      },
      recaptchaSecret: process.env.CONTACT_FORM_RECAPTCHA_SECRET,
    }),
    ModerationModule,
    ScheduleModule.forRoot(),
    // TODO: perhaps move to other modules
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
