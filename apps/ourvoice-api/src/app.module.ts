import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule.forRoot({
      // https://try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
      connectionURI: `${process.env.SUPERTOKENS_URI}`,
      apiKey: `${process.env.SUPERTOKENS_API_KEY}`,
      appInfo: {
        // Learn more about this on https://supertokens.com/docs/emailpassword/appinfo
        appName: `${process.env.APP_NAME}`,
        apiDomain: `${process.env.API_DOMAIN}`,
        websiteDomain: `${process.env.WEBSITE_DOMAIN}`,
        apiBasePath: '/auth',
        websiteBasePath: '/auth',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
