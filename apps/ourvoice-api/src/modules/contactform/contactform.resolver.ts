import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ContactFormEntryCreateInput } from '../../graphql';
import { Injectable } from '@nestjs/common';
import { ContactFormService } from './contactform.service';

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
