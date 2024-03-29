import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Expense } from './models/expense.model';
import { ExpenseSource } from './models/expense-source.model';
import { ExpenseService } from './services/expense.service';
import { ExpenseController } from './controllers/expense.controller';
import { AccountModule } from 'src/accounts/acount.module';
import { ExpenseSourceService } from './services/expense-source.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Expense, ExpenseSource]),
    AccountModule,
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService, ExpenseSourceService],
  exports: [ExpenseSourceService],
})
export default class ExpenseModule {}
