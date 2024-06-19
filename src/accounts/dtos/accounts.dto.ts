import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateAccountDto {
  @IsPositive()
  @IsNumber()
  amount!: number;

  @IsNumber()
  @IsPositive()
  bankId!: number;

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
