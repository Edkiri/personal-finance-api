import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op, Transaction } from 'sequelize';
import {
  CreateIncomeDto,
  FindIncomeQueryDto,
  UpdateIncomeDto,
} from 'src/incomes/dtos/income.dto';
import { IncomeSourceService } from './income-source.service';
import { AccountService } from 'src/accounts/services/account.service';
import { Income } from '../models/income.model';
import { IncomeSource } from '../models/income-source.model';
import { Currency } from 'src/accounts/models/currency.model';
import { Account } from 'src/accounts/models/account.model';

@Injectable()
export class IncomeService {
  constructor(
    private readonly sequelize: Sequelize,
    @InjectModel(Income)
    private readonly incomeModel: typeof Income,
    private readonly incomeSourceService: IncomeSourceService,
    private readonly accountService: AccountService,
  ) {}

  public async create(
    userId: number,
    data: CreateIncomeDto,
  ): Promise<Income | null> {
    const incomeSource = await this.incomeSourceService.findByNameOrCreate(
      data.incomeSourceName,
    );
    const account = await this.accountService.findById(data.accountId);
    const income = await this.incomeModel.create<Income | null>({
      userId,
      accountId: data.accountId,
      currencyId: account.currencyId,
      amount: data.amount,
      description: data.description,
      incomeSourceId: incomeSource.id,
      date: data.date,
    });
    await this.accountService.increseAmount(data.accountId, data.amount);
    return income ?? null;
  }

  public async findByUserId(
    userId: number,
    data: FindIncomeQueryDto,
  ): Promise<Income[]> {
    const query: any = { userId, accountId: data.accountId };

    if (data.dateFrom !== undefined) {
      const { dateFrom } = data;
      const startDate = new Date(dateFrom);
      startDate.setHours(0, 0, 0, 0);

      const dateTo = data.dateTo ?? new Date();
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);

      query.date = { [Op.between]: [startDate, endDate] };
    }

    if (data.incomeSourceIds !== undefined) {
      query.incomeSourceId = { [Op.in]: data.incomeSourceIds };
    }

    const incomes = await this.incomeModel.findAll({
      where: query,
      include: [IncomeSource, Currency],
      order: [['date', 'DESC']],
    });

    return incomes;
  }

  public async findById(incomeId: number): Promise<Income | null> {
    return this.incomeModel.findByPk(incomeId, {
      include: [Currency, Account, IncomeSource],
    });
  }

  public async delete(incomeId: number): Promise<void> {
    const income = await this.incomeModel.findByPk(incomeId);
    if (!income) throw new NotFoundException('income not found');
    await this.incomeModel.destroy({
      where: { id: incomeId },
    });
    await this.accountService.decreseAmount(income.accountId, income.amount);
  }

  public async update(incomeId: number, data: UpdateIncomeDto): Promise<void> {
    await this.sequelize.transaction(async (transaction: Transaction) => {
      const income = await this.findById(incomeId);
      if (!income) throw new NotFoundException('Expense not found');

      const originalAccount = await this.accountService.findById(
        income.accountId,
      );

      if (data.amount !== undefined) {
        const isSameAccount =
          data.accountId === undefined || data.accountId === income.accountId;
        if (isSameAccount) {
          const amountDifference = data.amount - income.amount;
          originalAccount.amount += amountDifference;

          await originalAccount.save({ transaction });
        }

        const isOtherAccount =
          data.accountId !== undefined && data.accountId !== income.accountId;
        if (isOtherAccount) {
          const newAccount = await this.accountService.findById(data.accountId);
          if (!newAccount) throw new NotFoundException('Account not found');

          originalAccount.amount -= income.amount;
          newAccount.amount += data.amount;
          await originalAccount.save({ transaction });
          await newAccount.save({ transaction });
        }

        income.amount = data.amount;
      }

      if (data.accountId !== undefined) {
        income.accountId = data.accountId;
      }

      if (data.date !== undefined) {
        income.date = data.date;
      }

      if (data.incomeSourceName !== undefined) {
        const incomeSource = await this.incomeSourceService.findByNameOrCreate(
          data.incomeSourceName,
        );
        if (incomeSource.id !== income.incomeSource.id) {
          income.incomeSourceId = incomeSource.id;
        }
      }

      if (data.description !== undefined) {
        income.description = data.description;
      }

      await income.save({ transaction });
    });
  }
}
