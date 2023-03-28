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

  // TODO: add website domain
  const whitelist: string[] = [
    'http://localhost:3000',
    'http://localhost:3010',
    'http://localhost:3020',
    'http://localhost:3030',
  ];

  app.enableCors({
    // origin: [`${configService.get('ORIGIN')}`], // TODO: URL of the website domain
    origin: function (origin, callback) {
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

  //TODO: initiate roles based on config yml/json
  await createRole('user');
  await createRole('moderator');
  await createRole('admin');
  await app.listen(configService.get('PORT') as number);
}

bootstrap();
