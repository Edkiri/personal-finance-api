import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ExpenseService } from '../services/expense.service';
import { CreateExpenseDto } from '../dtos/expenses';
import { ExpenseSourceService } from '../services/expense-source.service';

@Controller('expenses')
export class ExpenseController {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly expenseSourceService: ExpenseSourceService,
  ) {}

  @Post()
  async createExpense(@Body() data: CreateExpenseDto) {
    await this.expenseService.create(data);
    return;
  }

  @Get()
  async findExpenses() {
    const expenses = await this.expenseService.find();
    return expenses.map((expense) => expense.toJSON());
  }

  @Get('sources')
  async getAllExpenseSources() {
    const expenseSources = await this.expenseSourceService.findAll();
    return expenseSources.map((source) => source.toJSON());
  }

  @Delete(':expenseId')
  async deleteExpense(@Param('expenseId', ParseIntPipe) expenseId: number) {
    await this.expenseService.delete(expenseId);
    return;
  }
}
