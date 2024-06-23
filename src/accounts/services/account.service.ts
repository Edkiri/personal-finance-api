import { InjectModel } from '@nestjs/sequelize';
import { Account } from '../models/account.model';
import { NotFoundException } from '@nestjs/common';
import { Currency } from '../models/currency.model';
import { CreateAccountDto, UpdateAccountDto } from '../dtos/accounts.dto';

export class AccountService {
  constructor(
    @InjectModel(Account) private readonly acountModel: typeof Account,
  ) {}

  async create(userId: number, data: CreateAccountDto): Promise<void> {
    await this.acountModel.create({
      userId,
      name: data.name,
      description: data.description,
      amount: data.amount,
      bank: data.bank,
      currencyId: data.currencyId
    });
  }

  async update(accountId: number, data: UpdateAccountDto): Promise<void> {
    const account = await this.acountModel.findByPk(accountId);
    account.amount = data.amount;
    account.bank = data.bank;
    account.currencyId = data.currencyId;
    account.name = data.name;
    account.description = data.description;
    await account.save();
  }

  async findByUserId(userId: number): Promise<Account[]> {
    return this.acountModel.findAll({
      where: { userId },
      include: [Currency],
    });
  }

  async findById(accountId: number): Promise<Account | null> {
    return this.acountModel.findByPk(accountId);
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
