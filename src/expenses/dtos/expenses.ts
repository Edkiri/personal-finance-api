import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateExpenseDto {
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
  expenseSourceName!: string;

  @IsString()
  @IsOptional()
  description?: string;
}
