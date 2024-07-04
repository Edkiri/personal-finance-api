import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Currency } from 'src/accounts/models/currency.model';
import { AppSequelizeModule } from 'src/databases/app-sequelize.module';
import { SeederService } from './seeder.service';
import { Account } from 'src/accounts/models/account.model';
import { User } from 'src/users/models/user.model';
import { Expense } from 'src/expenses/models/expense.model';
import { ExpenseSource } from 'src/expenses/models/expense-source.model';
import { UserProfile } from 'src/users/models/profile.model';

@Module({
  imports: [
    AppSequelizeModule,
    SequelizeModule.forFeature([
      Currency,
      Account,
      User,
      UserProfile,
      Expense,
      ExpenseSource,
    ]),
  ],
  providers: [SeederService],
})
export class SeederModule {}
