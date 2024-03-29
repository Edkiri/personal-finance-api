import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { DebtService } from '../services/debt.model';
import { CreateDebtDto } from '../dtos/debts';
import { Debt } from '../models/debt.model';
import { DebtExpenseService } from '../services/debt-expense.service';
import { PayDebtDto } from '../dtos/debt-expense';

@Controller('debts')
export class DebtController {
  constructor(
    private readonly debtService: DebtService,
    private readonly debtExpenseService: DebtExpenseService,
  ) {}

  @Post()
  @HttpCode(204)
  async create(@Body() data: CreateDebtDto): Promise<void> {
    await this.debtService.create(data);
    return;
  }

  @Get()
  async find(): Promise<Debt[]> {
    const services = await this.debtService.findAll();
    return services.map((debt) => debt.toJSON());
  }

  @Post('/pay')
  @HttpCode(204)
  async createDebtExpense(@Body() data: PayDebtDto) {
    await this.debtExpenseService.payDebt(data);
    return;
  }
}
