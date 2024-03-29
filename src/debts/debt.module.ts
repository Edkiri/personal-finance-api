import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Debt } from './models/debt.model';
import ExpenseModule from 'src/expenses/expense.module';
import { DebtController } from './controllers/debt.controller';
import { DebtService } from './services/debt.model';

@Module({
  imports: [SequelizeModule.forFeature([Debt]), ExpenseModule],
  controllers: [DebtController],
  providers: [DebtService],
})
export default class DebtModule {}
