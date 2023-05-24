import { Injectable } from '@nestjs/common';
import { Prisma } from '@internal/prisma/contactform/index';
import { ContactFormPrismaService } from '../../database/contactform-prisma.service';

@Injectable()
export class ContactFormRepository {
  constructor(private readonly prisma: ContactFormPrismaService) {}

  async createContactFormEntry(data: Prisma.ContactFormEntryCreateInput) {
    return this.prisma.contactFormEntry.create({ data });
  }
}
