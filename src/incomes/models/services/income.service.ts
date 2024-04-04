import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Income } from '../income.model';
import { CreateIncomeDto } from 'src/incomes/dtos/create-income.dto';
import { IncomeSourceService } from './income-source.service';
import { AccountService } from 'src/accounts/services/account.service';
import { IncomeSource } from '../income-source.model';

@Injectable()
export class IncomeService {
  constructor(
    @InjectModel(Income)
    private readonly incomeModel: typeof Income,
    private readonly incomeSourceService: IncomeSourceService,
    private readonly accountService: AccountService,
  ) {}

  public async create(data: CreateIncomeDto): Promise<Income | null> {
    const incomeSource = await this.incomeSourceService.findByNameOrCreate(
      data.incomeSourceName,
    );
    const income = await this.incomeModel.create<Income | null>({
      accountId: data.accountId,
      amount: data.amount,
      description: data.description,
      incomeSourceId: incomeSource.id,
      date: data.date,
    });
    await this.accountService.increseAmount(data.accountId, data.amount);
    return income ?? null;
  }

  public async find(): Promise<Income[]> {
    const query = {};
    const incomes = await this.incomeModel.findAll({
      where: query,
      include: IncomeSource,
    });
    return incomes;
  }

  public async delete(incomeId: number): Promise<void> {
    const income = await this.incomeModel.findByPk(incomeId);
    if (!income) throw new NotFoundException('income not found');
    await this.incomeModel.destroy({
      where: { id: incomeId },
    });
    await this.accountService.decreseAmount(income.accountId, income.amount);
  }
}
