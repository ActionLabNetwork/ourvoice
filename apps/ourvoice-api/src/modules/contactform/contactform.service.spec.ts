import {
  ContactFormService,
  MAX_CONTACT_FORM_MESSAGE_LENGTH,
  MAX_CONTACT_FORM_NAME_LENGTH,
} from './contactform.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ContactFormRepository } from './contactform.repository';
import { Test } from '@nestjs/testing';
import { ContactFormPrismaService } from '../../database/contactform-prisma.service';
import { ContactFormEntryCreateInput } from '../../graphql';
import { BadRequestException } from '@nestjs/common';
import { ConfigInjectionToken } from './config.interface';

describe('ContactFormService', () => {
  let contactFormService: ContactFormService;
  let contactFormRepositoryMock: DeepMocked<ContactFormRepository>;

  const validDummyData: ContactFormEntryCreateInput = {
    name: 'valid name',
    email: 'valid@email.com',
    message: 'valid message',
    recaptchaToken: 'some token',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigInjectionToken,
          useValue: {}, // not going to be read for the test
        },
        {
          provide: ContactFormRepository,
          useValue: createMock<ContactFormRepository>(),
        },
        {
          provide: ContactFormPrismaService,
          // also needs to mock this to intercept recaptcha and email requests
          useValue: createMock<ContactFormPrismaService>(),
        },
        ContactFormService,
      ],
    }).compile();

    contactFormService = moduleRef.get(ContactFormService);
    contactFormRepositoryMock = moduleRef.get(ContactFormRepository);

    setCaptchaValid(true);
    jest
      .spyOn(contactFormService, 'sendEmail')
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .mockImplementation(async () => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const setCaptchaValid = (success: boolean) => {
    jest
      .spyOn(contactFormService, 'validateCaptcha')
      .mockImplementation(async () => {
        return { success };
      });
  };

  it('should create a contact form', async () => {
    // console.log(recaptchaServiceMock);
    await contactFormService.createContactFormEntry(validDummyData);
    const { name, email, message } = validDummyData;
    expect(contactFormRepositoryMock.createContactFormEntry).toBeCalledWith({
      name,
      email,
      message,
    });
  });

  it('should reject an invalid email', async () => {
    const badData = { ...validDummyData, email: 'not an email' };
    await expect(async () =>
      contactFormService.createContactFormEntry(badData),
    ).rejects.toThrow(BadRequestException);
  });

  it.each([
    { ...validDummyData, name: '' },
    { ...validDummyData, name: ' ' },
    { ...validDummyData, message: '' },
    { ...validDummyData, message: ' ' },
  ])(
    `should throw error when name or message is empty: '%s'`,
    async (badData: ContactFormEntryCreateInput) => {
      await expect(async () =>
        contactFormService.createContactFormEntry(badData),
      ).rejects.toThrow(BadRequestException);
    },
  );

  it('should throw error when name is too long', async () => {
    await expect(async () =>
      contactFormService.createContactFormEntry({
        ...validDummyData,
        name: 'a'.repeat(MAX_CONTACT_FORM_NAME_LENGTH + 1),
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw error when message is too long', async () => {
    await expect(async () =>
      contactFormService.createContactFormEntry({
        ...validDummyData,
        message: 'a'.repeat(MAX_CONTACT_FORM_MESSAGE_LENGTH + 1),
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw error when recaptcha is bad', async () => {
    setCaptchaValid(false);
    await expect(async () =>
      contactFormService.createContactFormEntry(validDummyData),
    ).rejects.toThrow(BadRequestException);
  });
});
