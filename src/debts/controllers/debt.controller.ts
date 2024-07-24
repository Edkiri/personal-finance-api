import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { DebtService } from '../services/debt.service';
import { CreateDebtDto } from '../dtos/debts';
import { Debt } from '../models/debt.model';
import { DebtExpenseService } from '../services/debt-expense.service';
import { PayDebtDto } from '../dtos/debt-expense';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { Request } from 'express';
import { IsAccountOwnerGuard } from 'src/accounts/guards/is-account-owner.guard';
import { IsDebtOwnerGuard } from '../guards/is-debt-owner.guard';

@Controller('debts')
@UseGuards(AuthenticatedGuard)
export class DebtController {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly debtService: DebtService,
    private readonly debtExpenseService: DebtExpenseService,
  ) {}

  @Post()
  @HttpCode(201)
  async create(
    @Req() req: Request,
    @Body() data: CreateDebtDto,
  ): Promise<void> {
    const userId = Number(req.user.userId);
    await this.debtService.create(userId, data);
    return;
  }

  @Get()
  async find(@Req() request: Request): Promise<Debt[]> {
    const userId = Number(request.user.userId);
    const services = await this.debtService.findAll(userId);
    return services.map((debt) => debt.toJSON());
  }

  @Post('/pay')
  @UseGuards(IsAccountOwnerGuard, IsDebtOwnerGuard)
  @HttpCode(201)
  async createDebtExpense(@Req() request: Request, @Body() data: PayDebtDto) {
    await this.sequelize.transaction(async (transaction) => {
      const userId = Number(request.user.userId);
      await this.debtExpenseService.payDebt(transaction, userId, data);
    });
    return;
  }
}
