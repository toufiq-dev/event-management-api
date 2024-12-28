import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';
import { DbService } from 'src/db/db.service';

@Injectable()
export class AttendeeService {
  constructor(private readonly dbService: DbService) {}

  async create(createAttendeeDto: CreateAttendeeDto) {
    return this.dbService.attendee.create({
      data: createAttendeeDto,
    });
  }

  async findAll() {
    return this.dbService.attendee.findMany();
  }

  async findOne(id: string) {
    const attendee = await this.dbService.attendee.findUnique({
      where: { id },
      include: {
        registrations: true,
      },
    });

    if (!attendee) {
      throw new NotFoundException(`Attendee with ID ${id} not found`);
    }

    return attendee;
  }

  async update(id: string, updateAttendeeDto: UpdateAttendeeDto) {
    return this.dbService.attendee.update({
      where: { id },
      data: updateAttendeeDto,
    });
  }

  async remove(id: string) {
    return this.dbService.attendee.delete({
      where: { id },
    });
  }
}
