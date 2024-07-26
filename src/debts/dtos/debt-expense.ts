import { IsDate, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PayDebtDto {
  @IsNumber()
  @IsPositive()
  debtId: number;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNumber()
  @IsPositive()
  accountId: number;

  @IsDate()
  @IsOptional()
  date: Date = new Date();
}
