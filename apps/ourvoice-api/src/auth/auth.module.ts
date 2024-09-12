import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common'

import { AuthMiddleware } from './auth.middleware'
import { AuthService } from './auth.service'
import {
  AuthModuleAsyncConfig,
  AuthModuleConfig,
  ConfigInjectionToken,
} from './config.interface'
import { SupertokensService } from './supertokens/supertokens.service'

@Module({
  providers: [],
  exports: [],
  controllers: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*')
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
    }
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
    }
  }
}
