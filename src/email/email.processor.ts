import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import * as nodemailer from 'nodemailer';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly configService: ConfigService) {}

  @Process('registrationEmail')
  async handleRegistrationEmail(job: Job) {
    try {
      const { to, eventName } = job.data;
      this.logger.debug(`Processing email job for: ${to}, event: ${eventName}`);

      const transporter = nodemailer.createTransport({
        host: this.configService.get('SMTP_HOST'),
        port: this.configService.get<number>('SMTP_PORT'),
        secure: false,
        auth: {
          user: this.configService.get('SMTP_USER'),
          pass: this.configService.get('SMTP_PASS'),
        },
      });

      // Verify SMTP connection
      await transporter.verify();
      this.logger.debug('SMTP connection verified');

      const result = await transporter.sendMail({
        from: `"Event Management" <${this.configService.get('SMTP_USER')}>`,
        to,
        subject: `Registration Confirmation for ${eventName}`,
        html: `
          <h1>Registration Confirmation</h1>
          <p>Thank you for registering for ${eventName}!</p>
          <p>We look forward to seeing you at the event.</p>
        `,
      });

      this.logger.debug(`Email sent successfully: ${result.messageId}`);
      return result;
    } catch (error) {
      this.logger.error('Failed to send email:', error);
      throw error;
    }
  }
}
