import { Module } from '@nestjs/common';
import ExpenseModule from './expenses/expense.module';
import { AccountModule } from './accounts/acount.module';
import DebtModule from './debts/debt.module';
import IncomeModule from './incomes/income.module';
import { AppSequelizeModule } from './databases/app-sequelize.module';

@Module({
  imports: [
    AppSequelizeModule,
    ExpenseModule,
    AccountModule,
    DebtModule,
    IncomeModule,
  ],
  controllers: [],
  providers: [],
})
export default class AppModule {}
