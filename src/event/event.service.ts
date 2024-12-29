import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FilterByDateDto } from './dto/filter-by-date.dto';
import { CacheService } from 'src/cache/cache.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EventService {
  private readonly eventCacheKey = 'events:list';
  private readonly cacheTTL: number;

  constructor(
    private readonly dbService: DbService,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {
    this.cacheTTL = parseInt(this.configService.get('CACHE_TTL', '3600'), 10);
  }

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
    const cachedEvents = await this.cacheService.get(this.eventCacheKey);

    if (cachedEvents) {
      return JSON.parse(cachedEvents);
    }

    const events = await this.dbService.event.findMany({
      orderBy: { date: 'desc' },
    });

    await this.cacheService.set(
      this.eventCacheKey,
      JSON.stringify(events),
      this.cacheTTL,
    );

    return events;
  }

  async findOne(id: string) {
    const cacheKey = `event:${id}`;
    const cachedEvent = await this.cacheService.get(cacheKey);

    if (cachedEvent) {
      return JSON.parse(cachedEvent);
    }

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

    await this.cacheService.set(cacheKey, JSON.stringify(event), this.cacheTTL);

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
      throw new NotFoundException(
        'No events found for the provided date range',
      );
    }

    return events;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const updatedEvent = await this.dbService.event.update({
      where: { id },
      data: updateEventDto,
    });

    await this.cacheService.del(this.eventCacheKey);
    await this.cacheService.del(`event:${id}`);

    return updatedEvent;
  }

  async remove(id: string) {
    const deletedEvent = await this.dbService.event.delete({
      where: { id },
    });

    await this.cacheService.del(this.eventCacheKey);
    await this.cacheService.del(`event:${id}`);

    return deletedEvent;
  }
}
