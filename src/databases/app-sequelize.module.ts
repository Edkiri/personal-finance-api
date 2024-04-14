import { Module, Global } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from 'src/accounts/models/account.model';
import { Bank } from 'src/accounts/models/bank.model';
import { Currency } from 'src/accounts/models/currency.model';
import { DebtExpense } from 'src/debts/models/debt-expense.mode';
import { Debt } from 'src/debts/models/debt.model';
import { ExpenseSource } from 'src/expenses/models/expense-source.model';
import { Expense } from 'src/expenses/models/expense.model';
import { IncomeSource } from 'src/incomes/models/income-source.model';
import { Income } from 'src/incomes/models/income.model';
import * as dotenv from 'dotenv';

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
        Account,
        Bank,
        Currency,
        Income,
        IncomeSource,
        ExpenseSource,
        Expense,
        Debt,
        DebtExpense,
      ],
      autoLoadModels: true,
      synchronize: true,
      logging: false,
    }),
  ],
  providers: [],
  exports: [],
})
export class AppSequelizeModule {}
