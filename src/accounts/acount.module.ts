import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from './models/account.model';
import { AccountService } from './services/account.service';
import { AccountController } from './controllers/account.controller';
import { CurrencyController } from './controllers/currency.controller';
import { CurrencyService } from './services/currency.service';
import { Currency } from './models/currency.model';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [SequelizeModule.forFeature([Account, Currency]), UserModule],
  controllers: [AccountController, CurrencyController],
  providers: [AccountService, CurrencyService],
  exports: [AccountService],
})
export class AccountModule {}
