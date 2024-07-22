import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateIncomeDto {
  @IsPositive()
  @IsNumber()
  amount!: number;

  @IsNumber()
  @IsPositive()
  accountId!: number;

  @IsDate()
  @IsOptional()
  date: Date = new Date();

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  incomeSourceName!: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class FindIncomeQueryDto {
  @IsNumber()
  @IsPositive()
  accountId: number;

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
  incomeSourceIds?: number[];
}