import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateAccountDto {
  @IsPositive()
  @IsNumber()
  amount!: number;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  bank!: string;

  @IsNumber()
  @IsPositive()
  currencyId!: number;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  name!: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsOptional()
  description?: string;
}

export class UpdateAccountDto {
  @IsPositive()
  @IsNumber()
  amount!: number;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  bank!: string;

  @IsNumber()
  @IsPositive()
  currencyId!: number;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  name!: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsOptional()
  description?: string;
}
