import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DbService } from 'src/db/db.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class EventScheduler {
  private readonly logger = new Logger(EventScheduler.name);

  constructor(
    private readonly dbService: DbService,
    private readonly emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR) // Runs every hour
  async sendEventReminders() {
    this.logger.debug('Checking for events happening in the next 24 hours...');

    const now = new Date();
    const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const upcomingEvents = await this.dbService.event.findMany({
      where: {
        date: {
          gte: now,
          lte: nextDay,
        },
      },
      include: {
        registrations: {
          include: {
            attendee: true,
          },
        },
      },
    });

    for (const event of upcomingEvents) {
      for (const registration of event.registrations) {
        const { name, email } = registration.attendee;
        const eventName = event.name;
        const eventDate = event.date.toISOString().slice(0, 10);

        this.logger.debug(
          `Queuing reminder email for attendee: ${name} (${email}) for event: ${eventName}`,
        );

        await this.emailService.sendEventReminder(email, eventName, eventDate);
      }
    }
  }
}
