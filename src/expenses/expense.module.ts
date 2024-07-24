import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Expense } from './models/expense.model';
import { ExpenseSource } from './models/expense-source.model';
import { ExpenseService } from './services/expense.service';
import { ExpenseController } from './controllers/expense.controller';
import { AccountModule } from 'src/accounts/acount.module';
import { ExpenseSourceService } from './services/expense-source.service';
import { UserModule } from 'src/users/user.module';
import DebtModule from 'src/debts/debt.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Expense, ExpenseSource]),
    UserModule,
    AccountModule,
    forwardRef(() => DebtModule),
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService, ExpenseSourceService],
  exports: [ExpenseSourceService, ExpenseService],
})
export default class ExpenseModule {}
