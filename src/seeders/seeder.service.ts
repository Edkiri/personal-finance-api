import { Injectable } from '@nestjs/common';
import { ExpenseService } from 'src/expenses/services/expense.service';
import MOCK_EXPENSES from './data/expenses';

@Injectable()
export class SeederService {
  constructor(private readonly expenseService: ExpenseService) {}

  async seed() {
    await this.seedExpenses();
  }

  async seedExpenses() {
    try {
      for (const expense of MOCK_EXPENSES) {
        await this.expenseService.create(expense);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
