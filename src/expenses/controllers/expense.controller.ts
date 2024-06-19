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
} from '@nestjs/common';
import { ExpenseService } from '../services/expense.service';
import { CreateExpenseDto } from '../dtos/expenses';
import { ExpenseSourceService } from '../services/expense-source.service';
import { FindExpenseQueryDto } from '../dtos/find-expense-filter';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { Request } from 'express';
import { IsExpenseOwnerGuard } from '../guards/is-expense-owner.guard';
import { IsAccountOwnerGuard } from 'src/accounts/guards/is-account-owner.guard';

@Controller('expenses')
@UseGuards(AuthenticatedGuard)
export class ExpenseController {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly expenseSourceService: ExpenseSourceService,
  ) {}

  @Post()
  @UseGuards(IsAccountOwnerGuard)
  async createExpense(@Req() request: Request, @Body() data: CreateExpenseDto) {
    const userId = request.user.userId;
    await this.expenseService.create(userId, data);
    return;
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
  async getAllExpenseSources() {
    const expenseSources = await this.expenseSourceService.findAll();
    return expenseSources.map((source) => source.toJSON());
  }

  @Delete(':expenseId')
  @UseGuards(IsExpenseOwnerGuard)
  @HttpCode(204)
  async deleteExpense(@Param('expenseId', ParseIntPipe) expenseId: number) {
    await this.expenseService.delete(expenseId);
    return;
  }
}
