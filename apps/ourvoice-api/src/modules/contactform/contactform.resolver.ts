import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ContactFormEntryCreateInput } from '../../graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { ContactFormService } from './contactform.service';
import { AuthGuard } from '../../auth/auth.guard';

@UseGuards(new AuthGuard())
@Resolver('ContactForm')
@Injectable()
export class ContactFormResolver {
  constructor(private readonly contactFormService: ContactFormService) {}

  @Mutation()
  async createContactFormEntry(
    @Args('data') data: ContactFormEntryCreateInput,
  ) {
    return this.contactFormService.createContactFormEntry(data);
  }
}
