import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class FindExpenseQueryDto {
  @IsNumber()
  @IsPositive()
  accountId: number;

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

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  @IsOptional()
  expenseSourceIds?: number[];
}
