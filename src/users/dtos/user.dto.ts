import { CreateAccountDto } from 'src/accounts/dtos/accounts.dto';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, ArrayNotEmpty } from 'class-validator';

export class OnboardUserDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateAccountDto)
  accounts: CreateAccountDto[];
}
