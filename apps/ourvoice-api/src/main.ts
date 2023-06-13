import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { middleware, errorHandler } from 'supertokens-node/framework/express';

import supertokens from 'supertokens-node';
import { SupertokensExceptionFilter } from './auth/auth.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // TODO: add website domains
  const whitelist: string[] = [
    // 'http://localhost:4173', // cypress
    configService.get('VITE_APP_LOCALHOST_ORIGIN'),
    configService.get('VITE_APP_API_URL'), // APP itself
    configService.get('VITE_APP_ADMIN_URL'), // ADMIN
    configService.get('VITE_APP_APP_DOMAIN'), // DOMAIN
  ];
  app.enableCors({
    origin: function (origin, callback) {
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
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  app.use(middleware());
  app.use(errorHandler());
  app.useGlobalFilters(new SupertokensExceptionFilter());
  await app.listen(configService.get<number>('API_PORT') || 3000);
}

bootstrap();
