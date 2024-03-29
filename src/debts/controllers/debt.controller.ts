import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { DebtService } from '../services/debt.model';
import { CreateDebtDto } from '../dtos/debts';
import { Debt } from '../models/debt.model';

@Controller('debts')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

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
}
