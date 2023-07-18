import { Injectable } from '@nestjs/common';
import {
  Prisma,
  ContactFormEntry,
} from '@internals/@prisma-contactform-db/client';
import { ContactFormPrismaService } from '../../database/contactform-prisma.service';

@Injectable()
export class ContactFormRepository {
  constructor(private readonly prisma: ContactFormPrismaService) {}

  async createContactFormEntry(
    data: Prisma.ContactFormEntryCreateInput,
  ): Promise<ContactFormEntry> {
    return this.prisma.contactFormEntry.create({ data });
  }
}
