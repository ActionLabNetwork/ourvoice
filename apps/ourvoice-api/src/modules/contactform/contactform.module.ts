import { DynamicModule, Module } from '@nestjs/common';
import { ContactFormPrismaService } from '../../database/contactform-prisma.service';
import { ContactFormRepository } from './contactform.repository';
import { ContactFormService } from './contactform.service';
import {
  ConfigInjectionToken,
  ContactFormModuleAsyncConfig,
  ContactFormModuleConfig,
} from './config.interface';
import { ContactFormResolver } from './contactform.resolver';

@Module({})
export class ContactFormModule {
  static register(config: ContactFormModuleConfig): DynamicModule {
    return {
      providers: [
        { provide: ConfigInjectionToken, useValue: config },
        ContactFormPrismaService,
        ContactFormRepository,
        ContactFormService,
        ContactFormResolver,
      ],
      module: ContactFormModule,
    };
  }

  static registerAsync(config: ContactFormModuleAsyncConfig): DynamicModule {
    return {
      imports: config.imports,
      module: ContactFormModule,
      providers: [
        {
          useFactory: config.useFactory,
          inject: config.inject,
          provide: ConfigInjectionToken,
        },
        ContactFormPrismaService,
        ContactFormRepository,
        ContactFormService,
        ContactFormResolver,
      ],
    };
  }
}
