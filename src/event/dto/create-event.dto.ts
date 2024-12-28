import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @ApiProperty({ description: 'Name of the event' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Description of the event' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Date of the event' })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiPropertyOptional({ description: 'Location of the event' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ description: 'Maximum number of attendees' })
  @IsInt()
  @Min(1)
  max_attendees: number;
}
