import {
  translationProvider,
  TranslationProvider,
} from '@/lib/providers/translation-provider';
import { render } from '@react-email/render';

import CertificateEmail from '@/emails/certificate';
import OTPEmail from '@/emails/otp';

export interface EmailContent {
  subject: string;
  html: string;
  plainText: string;
}

export class TemplateRender {
  private readonly translationProvider: TranslationProvider;

  constructor(translationsProvider: TranslationProvider) {
    this.translationProvider = translationsProvider;
  }

  async renderCertificate(
    courseName: string,
    link: string,
  ): Promise<EmailContent> {
    const locale = this.translationProvider.getLocale();
    const dictionary = this.translationProvider.getDictionaryInServer('email');
    const html = await render(
      CertificateEmail({ courseName, link, dictionary, locale }),
    );
    const plainText = await render(
      CertificateEmail({ courseName, link, dictionary, locale }),
      {
        plainText: true,
      },
    );
    const subject = this.getSubjectOfTemplate('certificate');
    return { subject, html, plainText };
  }

  async renderOTP(otp: string): Promise<EmailContent> {
    const dictionary = this.translationProvider.getDictionaryInServer('email');
    const locale = this.translationProvider.getLocale();
    const html = await render(OTPEmail({ otp, dictionary, locale }));
    const plainText = await render(OTPEmail({ otp, dictionary, locale }), {
      plainText: true,
    });
    const subject = this.getSubjectOfTemplate('otp');
    return { subject, html, plainText };
  }

  private getSubjectOfTemplate(filename: string): string {
    const dictionary = this.translationProvider.getDictionaryInServer('email');
    return dictionary[`${filename}-subject`] || '';
  }
}

export const templateRender = new TemplateRender(translationProvider);
