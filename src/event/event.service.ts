import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(private readonly dbService: DbService) {}

  async create(createEventDto: CreateEventDto) {
    // Check for overlapping events
    const overlappingEvent = await this.dbService.event.findFirst({
      where: {
        date: createEventDto.date,
      },
    });

    if (overlappingEvent) {
      throw new BadRequestException('An event already exists at this time');
    }

    return this.dbService.event.create({
      data: createEventDto,
    });
  }

  async findAll() {
    return this.dbService.event.findMany({
      orderBy: {
        date: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const event = await this.dbService.event.findUnique({
      where: { id },
      include: {
        registrations: {
          include: {
            attendee: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async findByDate(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const events = await this.dbService.event.findMany({
      where: {
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    if (!events.length) {
      throw new NotFoundException(`No events found for date ${date}`);
    }

    return events;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    return this.dbService.event.update({
      where: { id },
      data: updateEventDto,
    });
  }

  async remove(id: string) {
    return this.dbService.event.delete({
      where: { id },
    });
  }
}
