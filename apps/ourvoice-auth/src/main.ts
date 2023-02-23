import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import supertokens from 'supertokens-node';
import { SupertokensExceptionFilter } from './auth/auth.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: [`${configService.get('ORIGIN')}`], // TODO: URL of the website domain
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  app.useGlobalFilters(new SupertokensExceptionFilter());

  await app.listen(configService.get('PORT'));
}

bootstrap();
