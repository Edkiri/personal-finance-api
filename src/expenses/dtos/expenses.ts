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

export class UpdateExpenseDto {
  @IsPositive()
  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  accountId?: number;

  @IsDate()
  @IsOptional()
  date?: Date;

  @IsString()
  @IsOptional()
  expenseSourceName?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateExpenseSourceDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateExpenseSourceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
