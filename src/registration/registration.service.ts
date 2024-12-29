import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Injectable()
export class RegistrationService {
  constructor(private readonly dbService: DbService) {}

  async register(createRegistrationDto: CreateRegistrationDto) {
    const { event_id, attendee_id } = createRegistrationDto;

    // Validate event and attendee
    const event = await this.validateEvent(event_id);
    await this.validateAttendee(attendee_id);

    // Check for duplicate registration
    await this.checkDuplicateRegistration(event_id, attendee_id);

    // Check event capacity
    await this.checkEventCapacity(event_id, event.max_attendees);

    // Create the registration
    return this.dbService.registration.create({
      data: { event_id, attendee_id },
      include: { event: true, attendee: true },
    });
  }

  async findOne(event_id: string) {
    const registration = await this.dbService.registration.findFirst({
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
}
