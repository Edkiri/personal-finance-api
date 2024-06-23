import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Debt } from './models/debt.model';
import ExpenseModule from 'src/expenses/expense.module';
import { DebtController } from './controllers/debt.controller';
import { DebtService } from './services/debt.service';
import { DebtExpenseService } from './services/debt-expense.service';
import { DebtExpense } from './models/debt-expense.mode';
import { AccountModule } from 'src/accounts/acount.module';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Debt, DebtExpense]),
    ExpenseModule,
    AccountModule,
    UserModule,
  ],
  controllers: [DebtController],
  providers: [DebtService, DebtExpenseService],
})
export default class DebtModule {}
