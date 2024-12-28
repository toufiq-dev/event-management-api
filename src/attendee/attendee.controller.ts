import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AttendeeService } from './attendee.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Attendee')
@Controller('attendee')
export class AttendeeController {
  constructor(private readonly attendeeService: AttendeeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new attendee' })
  @ApiResponse({
    status: 201,
    description: 'The attendee has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  create(@Body() createAttendeeDto: CreateAttendeeDto) {
    return this.attendeeService.create(createAttendeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attendees' })
  @ApiResponse({
    status: 200,
    description: 'All attendees successfully retruned.',
  })
  findAll() {
    return this.attendeeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an attendee by ID' })
  @ApiResponse({
    status: 200,
    description: 'The attendee has been successfully returned.',
  })
  findOne(@Param('id') id: string) {
    return this.attendeeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an attendee by ID' })
  @ApiResponse({
    status: 200,
    description: 'The attendee updated successfully.',
  })
  update(
    @Param('id') id: string,
    @Body() updateAttendeeDto: UpdateAttendeeDto,
  ) {
    return this.attendeeService.update(id, updateAttendeeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an attendee by ID' })
  @ApiResponse({
    status: 200,
    description: 'The attendee deleted successfully.',
  })
  remove(@Param('id') id: string) {
    return this.attendeeService.remove(id);
  }
}
