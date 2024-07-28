import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { CreateAccountDto } from 'src/accounts/dtos/accounts.dto';
import { CreateExpenseSourceDto } from 'src/expenses/dtos/expenses';

export class LoginDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  password: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsEmail()
  email: string;
}

export class SignupDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(4, 24)
  @IsNotEmpty()
  username: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsEmail()
  email: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(8)
  password: string;
}

export class OnboardUserDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateAccountDto)
  accounts: CreateAccountDto[];

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateExpenseSourceDto)
  expenseSources: CreateExpenseSourceDto[];

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  currencyIds: number[];
}
