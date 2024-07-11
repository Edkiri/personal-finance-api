import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Account } from 'src/accounts/models/account.model';
import { Currency } from 'src/accounts/models/currency.model';
import { User } from 'src/users/models/user.model';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { ExpenseSource } from 'src/expenses/models/expense-source.model';
import { getRandomDateInLastWeek } from 'src/seeders/functions';
import { Expense } from 'src/expenses/models/expense.model';
import { UserProfile } from 'src/users/models/profile.model';
dotenv.config();

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Currency) private currencyModel: typeof Currency,
    @InjectModel(Account) private accountModel: typeof Account,
    @InjectModel(Expense) private expenseModel: typeof Expense,
    @InjectModel(UserProfile) private userProfileModel: typeof UserProfile,
    @InjectModel(ExpenseSource)
    private expenseSourceModel: typeof ExpenseSource,
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
    const admin = await this.userModel.create({
      username: process.env.ADMIN_USERNAME,
      password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
      email: process.env.ADMIN_EMAIL,
    });

    // Accounts
    const BBVA = await this.accountModel.create({
      name: 'Nómina',
      userId: admin.id,
      bank: 'BBVA',
      currencyId: EUR.id,
      amount: 500,
    });
    const MERCANTIL = await this.accountModel.create({
      name: 'Ahorro',
      userId: admin.id,
      bank: 'Mercantil',
      currencyId: EUR.id,
      amount: 600,
    });
    await this.userProfileModel.create({
      userId: admin.id,
      onboarded: true,
    });

    const expensesPath = 'src/seeders/data/expenses.json';
    const expensesFile = readFileSync(expensesPath, 'utf-8');

    type ExpensesJson = {
      description: string;
      expenseSourceName: string;
      amount: number;
    };

    const dataExpenseSources = JSON.parse(expensesFile)[
      'gastos'
    ] as ExpensesJson[];

    const expenseSources: Map<string, ExpenseSource> = new Map();

    for await (const dataExpenseSource of dataExpenseSources) {
      const { expenseSourceName } = dataExpenseSource;

      if (!expenseSources.has(expenseSourceName)) {
        const expenseSource = await this.expenseSourceModel.create({
          name: expenseSourceName,
        });
        expenseSources.set(expenseSourceName, expenseSource);
      }
    }

    for await (const dataExpenseSource of dataExpenseSources) {
      const { expenseSourceName, description, amount } = dataExpenseSource;
      const expenseSource = expenseSources.get(expenseSourceName);

      const date = getRandomDateInLastWeek();

      await this.expenseModel.create({
        expenseSourceId: expenseSource.id,
        accountId: BBVA.id,
        currencyId: BBVA.currencyId,
        userId: admin.id,
        description,
        amount,
        date,
      });
    }

    await this.expenseModel.create({
      expenseSourceId: 1,
      accountId: MERCANTIL.id,
      currencyId: BBVA.currencyId,
      userId: admin.id,
      description: 'Prueba 1',
      amount: 25,
      date: getRandomDateInLastWeek(),
    });

    await this.expenseModel.create({
      expenseSourceId: 3,
      accountId: MERCANTIL.id,
      currencyId: BBVA.currencyId,
      userId: admin.id,
      description: 'Prueba 2',
      amount: 50,
      date: getRandomDateInLastWeek(),
    });
  }
}
