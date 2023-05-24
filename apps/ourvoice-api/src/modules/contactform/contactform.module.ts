import { DynamicModule, Module } from '@nestjs/common';
import { ContactFormPrismaService } from '../../database/contactform-prisma.service';
import { ContactFormRepository } from './contactform.repository';
import { ContactFormService } from './contactform.service';
import {
  ConfigInjectionToken,
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
}
