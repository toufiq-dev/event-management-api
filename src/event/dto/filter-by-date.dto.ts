import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class FilterByDateDto {
  @ApiProperty({ description: 'Date to filter by' })
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
