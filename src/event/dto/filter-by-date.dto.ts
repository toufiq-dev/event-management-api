import { IsDateString } from 'class-validator';

export class FilterByDateDto {
  @IsDateString()
  date: string;
}
