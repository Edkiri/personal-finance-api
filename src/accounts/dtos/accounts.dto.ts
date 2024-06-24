import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateAccountDto {
  @IsInt()
  @Min(0, { message: 'Amount must be a positive number or zero' })
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

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}

export class UpdateAccountDto {
  @IsInt()
  @Min(0, { message: 'Amount must be a positive number or zero' })
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

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
