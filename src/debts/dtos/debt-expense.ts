import { IsNumber, IsPositive } from 'class-validator';

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
}
