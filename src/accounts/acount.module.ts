import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from './models/account.model';
import { AccountService } from './services/account.service';
import { AccountController } from './controllers/account.controller';
import { CurrencyController } from './controllers/currency.controller';
import { CurrencyService } from './services/currency.service';
import { Currency } from './models/currency.model';
import { UserModule } from 'src/users/user.module';
import { UserCurrencies } from './models/user-currencies.model';
import ExpenseModule from 'src/expenses/expense.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Account, Currency, UserCurrencies]),
    UserModule,
    forwardRef(() => ExpenseModule),
  ],
  controllers: [AccountController, CurrencyController],
  providers: [AccountService, CurrencyService],
  exports: [AccountService, CurrencyService],
})
export class AccountModule {}
