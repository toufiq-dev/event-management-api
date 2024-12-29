import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateRegistrationDto {
  @ApiProperty({ description: 'ID of the event' })
  @IsUUID()
  @IsNotEmpty()
  event_id: string;

  @ApiProperty({ description: 'ID of the attendee' })
  @IsUUID()
  @IsNotEmpty()
  attendee_id: string;
}
