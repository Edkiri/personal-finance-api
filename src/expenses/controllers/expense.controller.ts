import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  HttpCode,
  Query,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { ExpenseService } from '../services/expense.service';
import {
  CreateExpenseDto,
  CreateExpenseSourceDto,
  UpdateExpenseDto,
  UpdateExpenseSourceDto,
} from '../dtos/expenses';
import { ExpenseSourceService } from '../services/expense-source.service';
import { FindExpenseQueryDto } from '../dtos/find-expense-filter';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { Request } from 'express';
import { IsExpenseOwnerGuard } from '../guards/is-expense-owner.guard';
import { IsAccountOwnerGuard } from 'src/accounts/guards/is-account-owner.guard';
import { Sequelize } from 'sequelize-typescript';
import { DebtExpenseService } from 'src/debts/services/debt-expense.service';

@Controller('expenses')
@UseGuards(AuthenticatedGuard)
export class ExpenseController {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly expenseService: ExpenseService,
    private readonly expenseSourceService: ExpenseSourceService,
    private readonly debtExpenseService: DebtExpenseService,
  ) {}

  @Post()
  @UseGuards(IsAccountOwnerGuard)
  async createExpense(@Req() request: Request, @Body() data: CreateExpenseDto) {
    await this.sequelize.transaction(async (transaction) => {
      const userId = request.user.userId;
      await this.expenseService.create(transaction, userId, data);
    });
    return;
  }

  @Put(':expenseId')
  @UseGuards(IsExpenseOwnerGuard)
  async updateExpense(
    @Param('expenseId', ParseIntPipe) expenseId: number,
    @Body() data: UpdateExpenseDto,
  ) {
    await this.sequelize.transaction(async (transaction) => {
      const { debtExpenseService, expenseService } = this;

      const debtExpense = await debtExpenseService.findByExpenseId(expenseId);

      if (
        debtExpense &&
        data.amount !== undefined &&
        data.amount !== debtExpense.amount
      ) {
        await debtExpenseService.updatePayDebtAmount(
          transaction,
          debtExpense.id,
          data.amount,
        );
      }

      await expenseService.update(transaction, expenseId, data);
      return;
    });
  }

  @Get()
  async findExpenses(
    @Query() query: FindExpenseQueryDto,
    @Req() request: Request,
  ) {
    const userId = request.user.userId;

    const expenses = await this.expenseService.find(userId, query);
    return expenses.map((expense) => expense.toJSON());
  }

  @Get('sources')
  async getAllExpenseSources(@Req() request: Request) {
    const userId = request.user.userId;
    const expenseSources = await this.expenseSourceService.findAll(userId);
    return expenseSources.map((source) => source.toJSON());
  }

  @Post('sources')
  @HttpCode(201)
  async createExpenseSource(
    @Req() request: Request,
    @Body() data: CreateExpenseSourceDto,
  ) {
    const userId = request.user.userId;
    await this.expenseSourceService.create(userId, data);
    return;
  }

  @Put('sources/:expenseSourceId')
  @HttpCode(200)
  async updateExpenseSource(
    @Param('expenseSourceId', ParseIntPipe) expenseSourceId: number,
    @Body() data: UpdateExpenseSourceDto,
  ) {
    await this.expenseSourceService.update(expenseSourceId, data);
    return;
  }

  @Delete('sources/:expenseSourceId')
  @HttpCode(204)
  async deleteExpenseSource(
    @Param('expenseSourceId', ParseIntPipe) expenseSourceId: number,
  ) {
    await this.expenseSourceService.delete(expenseSourceId);
    return;
  }

  @Get(':expenseId')
  async findExpense(@Param('expenseId', ParseIntPipe) expenseId: number) {
    const expense = await this.expenseService.findById(expenseId);
    return expense.toJSON();
  }

  @Delete(':expenseId')
  @UseGuards(IsExpenseOwnerGuard)
  @HttpCode(204)
  async deleteExpense(@Param('expenseId', ParseIntPipe) expenseId: number) {
    await this.sequelize.transaction(async (transaction) => {
      const { debtExpenseService, expenseService } = this;

      const debtExpense = await debtExpenseService.findByExpenseId(expenseId);

      if (debtExpense) {
        await debtExpenseService.removePayDebt(transaction, debtExpense.id);
      }

      await expenseService.delete(transaction, expenseId);
    });
    return;
  }
}
