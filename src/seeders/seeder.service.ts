import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Account } from 'src/accounts/models/account.model';
import { Bank } from 'src/accounts/models/bank.model';
import { Currency } from 'src/accounts/models/currency.model';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Currency) private readonly currencyModel: typeof Currency,
    @InjectModel(Bank) private readonly bankModel: typeof Bank,
    @InjectModel(Account) private readonly accountModel: typeof Account,
  ) {}

  async seed() {
    // Currencies
    const eu = await this.currencyModel.create({ name: 'Euro', symbol: '€' });
    await this.currencyModel.create({ name: 'Dolar', symbol: '$' });

    // Bank
    const bbva = await this.bankModel.create({
      name: 'BBVA',
      description: 'España',
    });

    // Accounts
    await this.accountModel.create({
      name: 'Nómina',
      bankId: bbva.id,
      currencyId: eu.id,
      amount: 0,
    });
    await this.accountModel.create({
      name: 'Ahorro',
      bankId: bbva.id,
      currencyId: eu.id,
      amount: 0,
    });
  }
}
