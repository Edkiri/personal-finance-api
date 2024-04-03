import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class FindExpenseQueryDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  limit?: number;

  @IsNumber()
  @IsOptional()
  offset?: number;
}
