import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { middleware, errorHandler } from 'supertokens-node/framework/express';

import supertokens from 'supertokens-node';
import { SupertokensExceptionFilter } from './auth/auth.filter';
import { createRole } from './auth/roles.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // TODO: add admin and app addresses to list
  const whitelist: string[] = [
    configService.get('SUPERTOKENS_API_DOMAIN'),
    configService.get('SUPERTOKENS_WEBSITE_DOMAIN'),
    'http://localhost:3020',
    'http://localhost:3010',
    'http://demo.localhost:3010',
    'http://www.demo.localhost:3010',
  ];
  // TODO : use regex for all deployment names
  app.enableCors({
    // origin: [`${configService.get('ORIGIN')}`], // TODO: URL of the website domain
    origin: function (origin, callback) {
      console.log(origin);
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(
          new Error(`Origin ${origin} not permitted due to CORS policy`),
        );
      }
    },
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  app.use(middleware());
  app.use(errorHandler());
  app.useGlobalFilters(new SupertokensExceptionFilter());
  // create user roles
  configService
    .get<string[]>('roles')
    .map(async (role) => await createRole(role));
  await app.listen(configService.get('PORT') as number);
}

bootstrap();
