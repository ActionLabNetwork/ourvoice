import { ContactFormRepository } from './contactform.repository';
import { Prisma } from '@prisma-contactform-db/client';
import { ContactFormPrismaService } from '../../database/contactform-prisma.service';
import { Test } from '@nestjs/testing';

describe('ContactFormRepository', () => {
  let prismaService: ContactFormPrismaService;
  let contactFormRepository: ContactFormRepository;

  const testData: Prisma.ContactFormEntryCreateInput = {
    name: 'valid name',
    email: 'valid@email.com',
    message: 'valid message',
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ContactFormPrismaService, ContactFormRepository],
    }).compile();
    prismaService = moduleRef.get(ContactFormPrismaService);
    contactFormRepository = moduleRef.get(ContactFormRepository);
    prismaService.$connect();
  });

  afterAll(async () => {
    prismaService.$disconnect();
  });

  beforeEach(async () => {
    await prismaService.contactFormEntry.deleteMany({});
  });

  it('should create an entry', async () => {
    jest.spyOn(prismaService.contactFormEntry, 'create');

    await contactFormRepository.createContactFormEntry(testData);
    expect(prismaService.contactFormEntry.create).toHaveBeenCalledWith({
      data: testData,
    });

    const storedData = await prismaService.contactFormEntry.findMany();
    expect(storedData).toHaveLength(1);
    expect(storedData[0].name).toBe(testData.name);
    expect(storedData[0].email).toBe(testData.email);
    expect(storedData[0].message).toBe(testData.message);
  });
});
