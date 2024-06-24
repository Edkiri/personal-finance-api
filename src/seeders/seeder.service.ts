import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Account } from 'src/accounts/models/account.model';
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
    @InjectModel(Account) private readonly accountModel: typeof Account,
  ) {}

  async seed() {
    // Currencies
    const USD = await this.currencyModel.create({ name: 'Dólar', symbol: '$' });
    const EUR = await this.currencyModel.create({ name: 'Euro', symbol: '€' });
    const JPY = await this.currencyModel.create({ name: 'Yen', symbol: '¥' });
    const GBP = await this.currencyModel.create({ name: 'Libra', symbol: '£' });
    const CHF = await this.currencyModel.create({
      name: 'Franco',
      symbol: 'CHF',
    });

    // Admin user
    // const admin = await this.userModel.create({
    //   username: process.env.ADMIN_USERNAME,
    //   password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
    //   email: process.env.ADMIN_EMAIL,
    // });

    // Accounts
    // await this.accountModel.create({
    //   name: 'Nómina',
    //   userId: admin.id,
    //   bank: 'BBVA',
    //   currencyId: eu.id,
    //   amount: 0,
    // });
    // await this.accountModel.create({
    //   name: 'Ahorro',
    //   userId: admin.id,
    //   bank: 'BBVA',
    //   currencyId: eu.id,
    //   amount: 0,
    // });
  }
}
