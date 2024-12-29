import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class FilterByDateDto {
  @ApiProperty({
    description: 'Start date for filtering events (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiProperty({
    description: 'End date for filtering events (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;
}
