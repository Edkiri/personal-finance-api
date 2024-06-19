import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Account } from 'src/accounts/models/account.model';
import { Bank } from 'src/accounts/models/bank.model';
import { Currency } from 'src/accounts/models/currency.model';
import { User } from 'src/users/models/user.model';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
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

    // Admin user
    const admin = await this.userModel.create({
      username: process.env.ADMIN_USERNAME,
      password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
      email: process.env.ADMIN_EMAIL,
    });

    // Accounts
    await this.accountModel.create({
      name: 'Nómina',
      userId: admin.id,
      bankId: bbva.id,
      currencyId: eu.id,
      amount: 0,
    });
    await this.accountModel.create({
      name: 'Ahorro',
      userId: admin.id,
      bankId: bbva.id,
      currencyId: eu.id,
      amount: 0,
    });
  }
}
