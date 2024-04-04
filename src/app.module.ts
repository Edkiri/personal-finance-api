import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from './accounts/models/account.model';
import { Currency } from './accounts/models/currency.model';
import { Bank } from './accounts/models/bank.model';
import { IncomeSource } from './incomes/models/income-source.model';
import { ExpenseSource } from './expenses/models/expense-source.model';
import { Expense } from './expenses/models/expense.model';
import ExpenseModule from './expenses/expense.module';
import { AccountModule } from './accounts/acount.module';
import { Debt } from './debts/models/debt.model';
import DebtModule from './debts/debt.module';
import { DebtExpense } from './debts/models/debt-expense.mode';
import { Income } from './incomes/models/income.model';
import IncomeModule from './incomes/income.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'password',
      database: 'personal-finance',
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
    ExpenseModule,
    AccountModule,
    DebtModule,
    IncomeModule,
  ],
  controllers: [],
  providers: [],
})
export default class AppModule {}
