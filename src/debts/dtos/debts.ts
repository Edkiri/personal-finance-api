import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsDate,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class CreateDebtDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  creditor: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  @IsOptional()
  date: Date = new Date();

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  expenseSourceName: string;

  @IsNumber()
  @IsPositive()
  currencyId: number;
}
