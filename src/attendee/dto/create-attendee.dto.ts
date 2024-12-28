import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAttendeeDto {
  @ApiProperty({ description: 'Name of the attendee' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Email of the attendee' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
