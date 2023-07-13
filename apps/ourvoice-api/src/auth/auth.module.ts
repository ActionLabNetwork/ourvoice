import {
  MiddlewareConsumer,
  Module,
  NestModule,
  DynamicModule,
} from '@nestjs/common';

import { AuthMiddleware } from './auth.middleware';
import {
  ConfigInjectionToken,
  AuthModuleConfig,
  AuthModuleAsyncConfig,
} from './config.interface';
import { SupertokensService } from './supertokens/supertokens.service';
import { AuthService } from './auth.service';

@Module({
  providers: [],
  exports: [],
  controllers: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }

  static forRoot({
    connectionURI,
    apiKey,
    appInfo,
    smtpSettings,
    globalPepper,
  }: AuthModuleConfig): DynamicModule {
    return {
      providers: [
        {
          useValue: {
            appInfo,
            connectionURI,
            smtpSettings,
            apiKey,
            globalPepper,
          },
          provide: ConfigInjectionToken,
        },
        SupertokensService,
        AuthService,
      ],
      exports: [AuthService],
      imports: [],
      module: AuthModule,
    };
  }

  static forRootAsync(config: AuthModuleAsyncConfig): DynamicModule {
    return {
      module: AuthModule,
      imports: config.imports,
      providers: [
        {
          useFactory: config.useFactory,
          inject: config.inject,
          provide: ConfigInjectionToken,
        },
        SupertokensService,
        AuthService,
      ],
      exports: [AuthService],
    };
  }
}
