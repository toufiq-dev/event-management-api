import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FilterByDateDto } from './dto/filter-by-date.dto';

@ApiTags('Event')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all events' })
  @ApiResponse({
    status: 200,
    description: 'All events successfully returned',
  })
  findAll() {
    return this.eventService.findAll();
  }

  @Get('filter')
  @ApiOperation({ summary: 'Filter events by date' })
  @ApiResponse({ status: 200, description: 'Filtered events returned' })
  @ApiResponse({ status: 400, description: 'Invalid date filters provided' })
  async filterByDate(@Query() filterDto: FilterByDateDto) {
    if (!filterDto.start_date && !filterDto.end_date) {
      throw new BadRequestException(
        'At least one date filter must be provided',
      );
    }
    return this.eventService.filterByDate(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by id' })
  @ApiResponse({
    status: 200,
    description: 'The event has been sucessfully returned',
  })
  @ApiResponse({ status: 404, description: 'Event not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an event by id' })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event by id' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventService.remove(id);
  }
}
