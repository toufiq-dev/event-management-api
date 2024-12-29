import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(@InjectQueue('email') private readonly emailQueue: Queue) {}

  async sendRegistrationEmail(to: string, eventName: string) {
    try {
      this.logger.debug(`Queueing registration email for: ${to}`);
      const job = await this.emailQueue.add(
        'registrationEmail',
        { to, eventName },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      );
      this.logger.debug(`Email job created with ID: ${job.id}`);
      return job;
    } catch (error) {
      this.logger.error('Failed to queue email:', error);
      throw error;
    }
  }

  async sendEventReminder(to: string, eventName: string, eventDate: string) {
    try {
      this.logger.debug(`Queueing event reminder email for: ${to}`);
      const job = await this.emailQueue.add(
        'eventReminderEmail',
        { to, eventName, eventDate },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      );
      this.logger.debug(`Reminder email job created with ID: ${job.id}`);
      return job;
    } catch (error) {
      this.logger.error('Failed to queue event reminder email:', error);
      throw error;
    }
  }
}
