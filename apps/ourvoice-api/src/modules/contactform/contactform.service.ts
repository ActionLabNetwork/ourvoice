import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ContactFormRepository } from './contactform.repository';
import { ContactFormEntryCreateInput } from '../../graphql';
import { isEmail } from 'class-validator';
import * as nodemailer from 'nodemailer';
import {
  ConfigInjectionToken,
  ContactFormModuleConfig,
} from './config.interface';

export const MAX_CONTACT_FORM_NAME_LENGTH = 200;
export const MAX_CONTACT_FORM_MESSAGE_LENGTH = 1000;

@Injectable()
export class ContactFormService {
  constructor(
    @Inject(ConfigInjectionToken)
    private config: ContactFormModuleConfig,
    private readonly contactFormRepository: ContactFormRepository,
  ) {}

  async createContactFormEntry(data: ContactFormEntryCreateInput) {
    // should frontend code reference these values?
    if (
      !isEmail(data.email) ||
      data.name.match(/^\s*$/g) ||
      data.message.match(/^\s*$/g) ||
      data.message.length > MAX_CONTACT_FORM_MESSAGE_LENGTH ||
      data.name.length > MAX_CONTACT_FORM_NAME_LENGTH
    ) {
      throw new BadRequestException('invalid-form');
    }

    const captchaVerification = await this.validateCaptcha(data.recaptchaToken);
    if (!captchaVerification.success) {
      throw new BadRequestException('invalid-captcha');
    }

    await this.sendEmail(data.name, data.email, data.message);

    const { name, email, message } = data;
    await this.contactFormRepository.createContactFormEntry({
      name,
      email,
      message,
    });

    return 'success';
  }

  async validateCaptcha(token: string) {
    const recaptchaSecret = this.config.recaptchaSecret;
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${token}`,
      { method: 'POST' },
    );
    return await response.json();
  }

  async sendEmail(name, emailAddress, message) {
    const { host, port, user, pass } = this.config.smtpSettings;
    const transporter = nodemailer.createTransport({
      host,
      port,
      // depends on the SMTP backend, should probably be a configurable option
      requireTLS: true,
      secure: false,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: {
        name,
        address: emailAddress,
      },
      to: 'Administrator <admin@ourvoice.com>',
      subject: 'Portal Contact Form',
      text: message,
    });
  }
}
