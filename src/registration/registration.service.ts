import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { EmailService } from 'src/email/email.service';
import { LiveUpdateService } from 'src/websocket/live-update.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RegistrationService {
  private readonly logger = new Logger(RegistrationService.name);
  private readonly minimumSpotsThreshold: number;

  constructor(
    private readonly dbService: DbService,
    private readonly emailService: EmailService,
    private readonly liveUpdateService: LiveUpdateService,
    private readonly configService: ConfigService,
  ) {
    this.minimumSpotsThreshold = parseInt(
      this.configService.get('MINIMUM_SPOTS_THRESHOLD', '2'),
      10,
    );
  }

  async register(createRegistrationDto: CreateRegistrationDto) {
    const { event_id, attendee_id } = createRegistrationDto;

    const event = await this.validateEvent(event_id);
    const attendee = await this.validateAttendee(attendee_id);

    await this.checkDuplicateRegistration(event_id, attendee_id);

    await this.checkEventCapacity(event_id, event.max_attendees);

    // Create the registration
    const registration = await this.dbService.registration.create({
      data: { event_id, attendee_id },
      include: { event: true, attendee: true },
    });

    this.logger.log(
      `Registration created for attendee ${attendee.name} in event ${event.name}`,
    );

    // Trigger email notification
    await this.emailService.sendRegistrationEmail(attendee.email, event.name);

    // Check and notify if spots are nearing capacity
    const remainingSpots =
      event.max_attendees - (await this.countRegistrations(event_id));

    if (remainingSpots <= this.minimumSpotsThreshold) {
      this.liveUpdateService.notifySpotsFillingUp({
        eventName: event.name,
        remainingSpots,
      });
    }

    return registration;
  }

  async findRegistrationsByEvent(event_id: string) {
    const registration = await this.dbService.registration.findMany({
      where: { event_id },
      include: {
        event: true,
        attendee: true,
      },
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    return registration;
  }

  async cancel(registration_id: string) {
    const registration = await this.dbService.registration.findUnique({
      where: { id: registration_id },
    });

    if (!registration) {
      throw new NotFoundException('Registration does not exist');
    }

    this.logger.log(`Registration ${registration_id} canceled`);

    return this.dbService.registration.delete({
      where: { id: registration_id },
    });
  }

  private async validateEvent(event_id: string) {
    const event = await this.dbService.event.findUnique({
      where: { id: event_id },
    });

    if (!event) {
      throw new NotFoundException('Event does not exist');
    }

    return event;
  }

  private async validateAttendee(attendee_id: string) {
    const attendee = await this.dbService.attendee.findUnique({
      where: { id: attendee_id },
    });

    if (!attendee) {
      throw new NotFoundException('Attendee does not exist');
    }

    return attendee;
  }

  private async checkDuplicateRegistration(
    event_id: string,
    attendee_id: string,
  ) {
    const existingRegistration = await this.dbService.registration.findFirst({
      where: { event_id, attendee_id },
    });

    if (existingRegistration) {
      throw new BadRequestException(
        'Attendee is already registered for this event',
      );
    }
  }

  private async checkEventCapacity(event_id: string, max_attendees: number) {
    const registrationCount: number = await this.dbService.registration.count({
      where: { event_id },
    });

    if (registrationCount >= max_attendees) {
      throw new BadRequestException('Event has reached its maximum capacity');
    }
  }

  private async countRegistrations(event_id: string): Promise<number> {
    return this.dbService.registration.count({
      where: { event_id },
    });
  }
}
