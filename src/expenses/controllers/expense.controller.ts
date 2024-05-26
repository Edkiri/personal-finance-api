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
} from '@nestjs/common';
import { ExpenseService } from '../services/expense.service';
import { CreateExpenseDto } from '../dtos/expenses';
import { ExpenseSourceService } from '../services/expense-source.service';
import { FindExpenseQueryDto } from '../dtos/find-expense-filter';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';

@Controller('expenses')
@UseGuards(AuthenticatedGuard)
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
  async findExpenses(@Query() query: FindExpenseQueryDto) {
    const expenses = await this.expenseService.find(query);
    return expenses.map((expense) => expense.toJSON());
  }

  @Get('sources')
  async getAllExpenseSources() {
    const expenseSources = await this.expenseSourceService.findAll();
    return expenseSources.map((source) => source.toJSON());
  }

  @Delete(':expenseId')
  @HttpCode(204)
  async deleteExpense(@Param('expenseId', ParseIntPipe) expenseId: number) {
    await this.expenseService.delete(expenseId);
    return;
  }
}
