import { Resend } from 'resend';

export class EmailProvider {
  private readonly domain: string;
  private readonly email: string;
  private provider: Resend;

  constructor(apiKey: string, domain: string) {
    this.provider = new Resend(apiKey);
    this.domain = domain;
    this.email = `EduGlowUp <no-reply@${this.domain}>`;
  }

  async sendEmail(
    email: string,
    subject: string,
    html: string,
    text?: string,
  ): Promise<void> {
    const data = {
      from: this.email,
      to: email,
      subject: subject,
      html: html,
      ...(text && { text: text }),
    };

    // Don't send email if were are testing
    if (process.env.TESTING === 'test') return;

    await this.provider.emails.send(data);
  }
}

export const emailProvider = new EmailProvider(
  process.env.RESEND_API_KEY,
  process.env.WEB_DOMAIN,
);
