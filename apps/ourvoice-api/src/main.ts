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
    configService.get('ORIGIN'), // app itself
    'http://localhost:3010',
    'http://localhost:3020',
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

  await app.listen(configService.get('PORT') as number);
}

bootstrap();
