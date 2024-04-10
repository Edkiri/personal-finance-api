import { IsDate, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class FindExpenseQueryDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  limit?: number;

  @IsNumber()
  @IsOptional()
  offset?: number;

  @IsDate()
  @IsOptional()
  dateFrom?: Date;

  @IsDate()
  @IsOptional()
  dateTo?: Date;
}
