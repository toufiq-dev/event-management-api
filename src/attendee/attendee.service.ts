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

  async search(query: string) {
    const attendees = await this.dbService.attendee.findMany({
      where: {
        OR: [{ name: { contains: query } }, { email: { contains: query } }],
      },
    });

    if (!attendees.length) {
      throw new NotFoundException(`No attendees found for query: ${query}`);
    }

    return attendees;
  }

  async getAttendeesWithMultipleRegistrations() {
    const result: any = await this.dbService.$queryRaw`
      SELECT 
          a.id AS attendee_id, 
          a.name AS attendee_name,
          a.email as attendee_email,
          CAST(COUNT(r.event_id) AS INT) AS events_registered
      FROM 
          "Attendee" a
      JOIN 
          "Registration" r ON a.id = r.attendee_id
      GROUP BY 
          a.id
      HAVING 
          COUNT(r.event_id) > 1;
    `;

    if (!result.length) {
      throw new NotFoundException(
        'No attendees found with multiple registrations',
      );
    }

    return result;
  }
}
