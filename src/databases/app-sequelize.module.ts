import { Module, Global } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from 'src/accounts/models/account.model';
import { Currency } from 'src/accounts/models/currency.model';
import { DebtExpense } from 'src/debts/models/debt-expense.mode';
import { Debt } from 'src/debts/models/debt.model';
import { ExpenseSource } from 'src/expenses/models/expense-source.model';
import { Expense } from 'src/expenses/models/expense.model';
import { IncomeSource } from 'src/incomes/models/income-source.model';
import { Income } from 'src/incomes/models/income.model';
import * as dotenv from 'dotenv';
import { User } from 'src/users/models/user.model';
import { UserProfile } from 'src/users/models/profile.model';

// TODO: Make a configuration module to validate and export all env variables
dotenv.config();

@Global()
@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      username: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: Number(process.env.POSTGRES_PORT),
      models: [
        User,
        UserProfile,
        Account,
        Currency,
        Income,
        IncomeSource,
        ExpenseSource,
        Expense,
        Debt,
        DebtExpense,
      ],
      autoLoadModels: false,
      synchronize: false,
      logging: false,
    }),
  ],
  providers: [],
  exports: [],
})
export class AppSequelizeModule {}
