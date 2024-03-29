import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from './models/account.model';
import { AccountService } from './services/account.service';
import { AccountController } from './controllers/account.controller';

@Module({
  imports: [SequelizeModule.forFeature([Account])],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
