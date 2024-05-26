import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  password: string;
}
