import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

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
