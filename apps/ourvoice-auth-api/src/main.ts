import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { middleware, errorHandler } from 'supertokens-node/framework/express';

import supertokens from 'supertokens-node';
import { SupertokensExceptionFilter } from './auth/auth.filter';
import { createRole } from './auth/roles.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = await app.get(ConfigService);

  // configService.get<AuthOptions[]>('auth');

  // TODO: add admin and app addresses to list
  const whitelist: string[] = [
    configService.get('SUPERTOKENS_API_DOMAIN'),
    configService.get('VITE_APP_AUTH_URL'),
    configService.get('VITE_APP_ADMIN_URL'),
    configService.get('VITE_APP_APP_URL'),
  ];
  // TODO : use regex for all deployment names
  app.enableCors({
    // origin: [`${configService.get('ORIGIN')}`], // TODO: URL of the website domain
    origin: function (origin, callback) {
      const match = origin
        .toLowerCase()
        .match(/^https?:\/\/([\w\d]+\.)?ourvoice\.test$/);
      if (!origin || whitelist.indexOf(origin) !== -1 || match) {
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
