import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Expense } from '../models/expense.model';
import { CreateExpenseDto } from '../dtos/expenses';
import { ExpenseSourceService } from './expense-source.service';
import { AccountService } from 'src/accounts/services/account.service';
import { ExpenseSource } from '../models/expense-source.model';
import { FindExpenseQueryDto } from '../dtos/find-expense-filter';
import { Op } from 'sequelize';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense) private readonly expenseModel: typeof Expense,
    private readonly expenseSourceService: ExpenseSourceService,
    private readonly accountService: AccountService,
  ) {}

  public async findById(id: number): Promise<Expense | null> {
    const expense = await this.expenseModel.findByPk(id);
    return expense ?? null;
  }

  public async find(payload: FindExpenseQueryDto): Promise<Expense[]> {
    const query: any = {};

    if (payload.dateFrom) {
      const { dateFrom } = payload;
      const dateTo = payload.dateTo ?? new Date();
      query.date = { [Op.between]: [new Date(dateFrom), dateTo] };
    }

    const expenses = await this.expenseModel.findAll({
      where: query,
      include: ExpenseSource,
      limit: payload.limit,
      offset: payload.offset,
      order: [['date', 'DESC']],
    });
    return expenses;
  }

  public async create(data: CreateExpenseDto): Promise<Expense | null> {
    const expenseSource = await this.expenseSourceService.findByNameOrCreate(
      data.expenseSourceName,
    );
    const expense = await this.expenseModel.create<Expense | null>({
      accountId: data.accountId,
      amount: data.amount,
      description: data.description,
      expenseSourceId: expenseSource.id,
      date: data.date,
    });
    await this.accountService.decreseAmount(data.accountId, data.amount);
    return expense ?? null;
  }

  public async delete(expenseId: number): Promise<void> {
    const expense = await this.expenseModel.findByPk(expenseId);
    if (!expense) throw new NotFoundException('expense not found');
    await this.expenseModel.destroy({
      where: { id: expenseId },
    });
    await this.accountService.increseAmount(expense.accountId, expense.amount);
  }
}
