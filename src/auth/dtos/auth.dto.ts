import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

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