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

@Global()
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
  ],
  providers: [],
  exports: [],
})
export class AppSequelizeModule {}
