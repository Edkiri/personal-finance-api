import { InjectModel } from '@nestjs/sequelize';
import { Account } from '../models/account.model';
import { NotFoundException } from '@nestjs/common';
import { Bank } from '../models/bank.model';
import { Currency } from '../models/currency.model';

export class AccountService {
  constructor(
    @InjectModel(Account) private readonly acountModel: typeof Account,
  ) {}

  async findAll(): Promise<Account[]> {
    return this.acountModel.findAll({ include: [Bank, Currency] });
  }

  async decreseAmount(accountId: number, amount: number): Promise<void> {
    const account = await this.acountModel.findByPk(accountId);
    if (!account) {
      throw new NotFoundException('Account not found.');
    }
    this.acountModel.update(
      { amount: parseFloat((account.amount - amount).toFixed(3)) },
      { where: { id: account.id } },
    );
  }

  async increseAmount(accountId: number, amount: number): Promise<void> {
    const account = await this.acountModel.findByPk(accountId);
    if (!account) throw new NotFoundException('Account not found.');

    this.acountModel.update(
      { amount: parseFloat((account.amount + amount).toFixed(3)) },
      { where: { id: account.id } },
    );
  }
}
