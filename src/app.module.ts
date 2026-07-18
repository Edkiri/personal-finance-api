import { Module } from '@nestjs/common';
import ExpenseModule from './expenses/expense.module';
import { AccountModule } from './accounts/acount.module';
import DebtModule from './debts/debt.module';
import IncomeModule from './incomes/income.module';
import HabitModule from './habits/habit.module';
import { AppSequelizeModule } from './databases/app-sequelize.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    AppSequelizeModule,
    UserModule,
    ExpenseModule,
    AccountModule,
    DebtModule,
    IncomeModule,
    HabitModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export default class AppModule {}
