import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Bank } from 'src/accounts/models/bank.model';
import { Currency } from 'src/accounts/models/currency.model';
import { AppSequelizeModule } from 'src/databases/app-sequelize.module';
import { SeederService } from './seeder.service';
import { Account } from 'src/accounts/models/account.model';
import { User } from 'src/users/models/user.model';

@Module({
  imports: [
    AppSequelizeModule,
    SequelizeModule.forFeature([Currency, Bank, Account, User]),
  ],
  providers: [SeederService],
})
export class SeederModule {}
