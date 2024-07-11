import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Expense } from '../models/expense.model';
import { CreateExpenseDto } from '../dtos/expenses';
import { ExpenseSourceService } from './expense-source.service';
import { AccountService } from 'src/accounts/services/account.service';
import { ExpenseSource } from '../models/expense-source.model';
import { FindExpenseQueryDto } from '../dtos/find-expense-filter';
import { Op } from 'sequelize';
import { Currency } from 'src/accounts/models/currency.model';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense) private readonly expenseModel: typeof Expense,
    private readonly expenseSourceService: ExpenseSourceService,
    private readonly accountService: AccountService,
  ) {}

  public async findById(id: number): Promise<Expense | null> {
    return this.expenseModel.findByPk(id);
  }

  public async find(
    userId: number,
    payload: FindExpenseQueryDto,
  ): Promise<Expense[]> {
    const query: any = { userId, accountId: payload.accountId };

    if (payload.dateFrom) {
      const { dateFrom } = payload;
      const dateTo = payload.dateTo ?? new Date();
      query.date = { [Op.between]: [new Date(dateFrom), dateTo] };
    }

    if (payload.expenseSourceIds) {
      query.expenseSourceId = { [Op.in]: payload.expenseSourceIds };
    }

    const expenses = await this.expenseModel.findAll({
      where: query,
      include: [ExpenseSource, Currency],
      limit: payload.limit,
      offset: payload.offset,
      order: [['date', 'DESC']],
    });

    return expenses;
  }

  public async create(
    userId: number,
    data: CreateExpenseDto,
  ): Promise<Expense | null> {
    const expenseSource = await this.expenseSourceService.findByNameOrCreate(
      data.expenseSourceName,
    );
    const account = await this.accountService.findById(data.accountId);
    const expense = await this.expenseModel.create<Expense | null>({
      userId,
      accountId: data.accountId,
      amount: data.amount,
      description: data.description,
      expenseSourceId: expenseSource.id,
      date: data.date,
      currencyId: account.currencyId,
    });
    await this.accountService.decreseAmount(data.accountId, data.amount);
    return expense ?? null;
  }

  public async delete(expenseId: number): Promise<void> {
    const expense = await this.expenseModel.findByPk(expenseId);
    await this.expenseModel.destroy({
      where: { id: expenseId },
    });
    await this.accountService.increseAmount(expense.accountId, expense.amount);
  }
}
