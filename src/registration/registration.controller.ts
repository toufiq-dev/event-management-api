import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegistrationService } from './registration.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@ApiTags('Registration')
@Controller('registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  @ApiOperation({ summary: 'Register an attendee to an event' })
  @ApiResponse({
    status: 201,
    description: 'Registration created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or constraints violated',
  })
  create(@Body() createRegistrationDto: CreateRegistrationDto) {
    return this.registrationService.register(createRegistrationDto);
  }

  @Get(':event_id')
  @ApiOperation({ summary: 'List all registrations for an event' })
  @ApiResponse({
    status: 200,
    description: 'Registrations returned successfully',
  })
  @ApiResponse({ status: 404, description: 'Registration not found' })
  findOne(@Param('event_id', ParseUUIDPipe) event_id: string) {
    return this.registrationService.findOne(event_id);
  }
}
