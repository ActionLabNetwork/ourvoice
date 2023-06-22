import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { middleware, errorHandler } from 'supertokens-node/framework/express';

import supertokens from 'supertokens-node';
import { SupertokensExceptionFilter } from './auth/auth.filter';
import { createRole } from './auth/roles.service';
import {
  addEmailsToAllowlist,
  addModeratorsToAllowlist,
  // clearEmailAllowList,
} from './auth/metadata.service';
import { addSuperAdmin } from './seed';
import { ConfigService } from '@nestjs/config';
import { Role } from './auth/roles.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = await app.get(ConfigService);

  // configService.get<AuthOptions[]>('auth');

  // TODO: add admin and app addresses to list
  const whitelist: string[] = [
    configService.get('SUPERTOKENS_API_DOMAIN'), // app itself
    configService.get('VITE_APP_AUTH_URL'),
    configService.get('VITE_APP_ADMIN_URL'),
    configService.get('VITE_APP_APP_DOMAIN'),
  ];
  // TODO : use regex for all deployment names
  app.enableCors({
    origin: function (origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      // const match = origin
      //   .toLowerCase()
      //   .match(/^https?:\/\/([\w\d]+\.)?ourvoice\.test$/);
      // const domainWhiteList = /^(https?:\/\/([a-z0-9]+[.])ourvoice[.]test(?::\d{1,5})?)$/;
      const parts = origin ? origin.split('.') : origin;
      if (
        !origin ||
        whitelist.indexOf(origin) !== -1 ||
        whitelist.indexOf(
          `${parts[parts.length - 2]}.${parts[parts.length - 1]}`,
        ) !== -1
      ) {
        callback(null, true);
      } else {
        callback(
          new Error(`Origin ${origin} not permitted due to CORS policy`),
        );
      }
    },
    allowedHeaders: [
      'content-type',
      'deployment',
      ...supertokens.getAllCORSHeaders(),
    ],
    credentials: true,
  });

  app.use(middleware());
  app.use(errorHandler());
  app.useGlobalFilters(new SupertokensExceptionFilter());
  // create roles
  console.log('Creating roles...');
  configService
    .get<Role[]>('roles')
    .map(async (role) => await createRole(role.name, role.permissions));
  // if you need to clear the allowedEmails list
  // await clearEmailAllowList();
  // add allowed emails who can sign up
  console.log('Updating email allow list...');
  await addEmailsToAllowlist(configService.get<string[]>('allowedEmails'));
  // if you need to clear the allowedEmails list
  // await clearModeratorAllowList();
  // add moderators who can sign up using email
  console.log('Updating moderators list...');
  await addModeratorsToAllowlist(configService.get<string[]>('moderators'));
  // add super admin user
  await addSuperAdmin(
    configService.get<string>('SUPERTOKENS_ADMIN_EMAIL') ||
      'admin@ourvoice.app',
    configService.get<string>(
      'SUPERTOKENS_ADMIN_PASSWORD' || 'super-admin-pass',
    ),
  );
  await app.listen(configService.get<number>('AUTH_API_PORT') || 3001);
}

bootstrap();
