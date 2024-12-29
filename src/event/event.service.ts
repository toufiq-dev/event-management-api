import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FilterByDateDto } from './dto/filter-by-date.dto';

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

  async filterByDate(filterDto: FilterByDateDto) {
    const { start_date, end_date } = filterDto;

    const filters = {
      AND: [],
    };

    if (start_date) {
      filters.AND.push({
        date: { gte: new Date(start_date) },
      });
    }

    if (end_date) {
      filters.AND.push({
        date: { lte: new Date(end_date) },
      });
    }

    const events = await this.dbService.event.findMany({
      where: filters,
    });
  
    if (events.length === 0) {
      throw new NotFoundException('No events found for the provided date range');
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
