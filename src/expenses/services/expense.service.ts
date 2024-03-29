import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Expense } from '../models/expense.model';
import { CreateExpenseDto } from '../dtos/expenses';
import { ExpenseSourceService } from './expense-source.service';
import { AccountService } from 'src/accounts/services/account.service';
import { ExpenseSource } from '../models/expense-source.model';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense) private readonly expenseModel: typeof Expense,
    private readonly expenseSourceService: ExpenseSourceService,
    private readonly accontService: AccountService,
  ) {}

  public async find() {
    const query = {};
    const expenses = await this.expenseModel.findAll({
      where: query,
      include: ExpenseSource,
    });
    return expenses;
  }

  public async create(data: CreateExpenseDto) {
    const expenseSource = await this.expenseSourceService.findByNameOrCreate(
      data.expenseSourceName,
    );
    await this.expenseModel.create({
      accountId: data.accountId,
      amount: data.amount,
      description: data.description,
      expenseSourceId: expenseSource.id,
      date: data.date,
    });
    await this.accontService.decreseAmount(data.accountId, data.amount);
  }

  public async delete(expenseId: number): Promise<void> {
    const expense = await this.expenseModel.findByPk(expenseId);
    await this.expenseModel.destroy({ where: { id: expenseId } });
    await this.accontService.increseAmount(expense.accountId, expense.amount);
  }
}
