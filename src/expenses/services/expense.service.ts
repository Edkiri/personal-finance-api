import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Expense } from '../models/expense.model';
import { CreateExpenseDto, UpdateExpenseDto } from '../dtos/expenses';
import { ExpenseSourceService } from './expense-source.service';
import { AccountService } from 'src/accounts/services/account.service';
import { ExpenseSource } from '../models/expense-source.model';
import { FindExpenseQueryDto } from '../dtos/find-expense-filter';
import { Op, Transaction } from 'sequelize';
import { Currency } from 'src/accounts/models/currency.model';
import { Account } from 'src/accounts/models/account.model';
import { Sequelize } from 'sequelize-typescript';
import { add, subtract } from 'src/utils';

@Injectable()
export class ExpenseService {
  constructor(
    private readonly sequelize: Sequelize,
    @InjectModel(Expense) private readonly expenseModel: typeof Expense,
    private readonly expenseSourceService: ExpenseSourceService,
    private readonly accountService: AccountService,
  ) {}

  public async findById(id: number): Promise<Expense | null> {
    return this.expenseModel.findByPk(id, {
      include: [ExpenseSource, Currency, Account],
    });
  }

  public async find(
    userId: number,
    payload: FindExpenseQueryDto,
  ): Promise<Expense[]> {
    const query: any = { userId, accountId: payload.accountId };

    if (payload.dateFrom) {
      // Date From
      const { dateFrom } = payload;
      const startDate = new Date(dateFrom);
      startDate.setHours(0, 0, 0, 0);
      // Date To
      const dateTo = payload.dateTo ?? new Date();
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      query.date = { [Op.between]: [startDate, endDate] };
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
    transaction: Transaction,
    userId: number,
    data: CreateExpenseDto,
  ): Promise<Expense> {
    const expenseSource = await this.expenseSourceService.findByNameOrCreate(
      userId,
      data.expenseSourceName,
    );
    const account = await this.accountService.findById(data.accountId);

    const expense = await this.expenseModel.create(
      {
        userId,
        accountId: data.accountId,
        amount: data.amount,
        description: data.description,
        expenseSourceId: expenseSource.id,
        date: data.date,
        currencyId: account.currencyId,
      },
      { transaction },
    );
    await this.accountService.decreseAmount(
      transaction,
      data.accountId,
      data.amount,
    );
    return expense;
  }

  public async delete(
    transaction: Transaction,
    expenseId: number,
  ): Promise<void> {
    const expense = await this.expenseModel.findByPk(expenseId);

    await this.expenseModel.destroy({
      where: { id: expenseId },
      transaction,
    });

    await this.accountService.increseAmount(
      transaction,
      expense.accountId,
      expense.amount,
    );
  }

  public async update(
    transaction: Transaction,
    expenseId: number,
    data: UpdateExpenseDto,
  ): Promise<void> {
    const expense = await this.findById(expenseId);
    if (!expense) throw new NotFoundException('Expense not found');

    const originalAccount = await this.accountService.findById(
      expense.accountId,
    );

    if (data.amount !== undefined) {
      const isSameAccount =
        data.accountId === undefined || data.accountId === expense.accountId;

      if (isSameAccount) {
        const amountDifference = subtract(data.amount, expense.amount);
        originalAccount.amount = subtract(
          originalAccount.amount,
          amountDifference,
        );

        await originalAccount.save({ transaction });
      }

      const isOtherAccount =
        data.accountId !== undefined && data.accountId !== expense.accountId;

      if (isOtherAccount) {
        const newAccount = await this.accountService.findById(data.accountId);
        if (!newAccount) throw new NotFoundException('Account not found');

        originalAccount.amount = add(originalAccount.amount, expense.amount);
        newAccount.amount = subtract(newAccount.amount, data.amount);

        await originalAccount.save({ transaction });
        await newAccount.save({ transaction });
      }

      expense.amount = data.amount;
    }

    if (data.accountId !== undefined) {
      expense.accountId = data.accountId;
    }

    if (data.date !== undefined) {
      expense.date = data.date;
    }

    if (data.expenseSourceName !== undefined) {
      const expenseSource = await this.expenseSourceService.findByNameOrCreate(
        expense.userId,
        data.expenseSourceName,
      );
      if (expenseSource.id !== expense.expenseSource.id) {
        expense.expenseSourceId = expenseSource.id;
      }
    }

    if (data.description !== undefined) {
      expense.description = data.description;
    }

    await expense.save({ transaction });
  }
}
