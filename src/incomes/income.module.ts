import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Income } from './models/income.model';
import { IncomeSource } from './models/income-source.model';
import { AccountModule } from 'src/accounts/acount.module';
import { IncomeController } from './controllers/income.controller';
import { IncomeSourceService } from './services/income-source.service';
import { IncomeService } from './services/income.service';

@Module({
  imports: [SequelizeModule.forFeature([Income, IncomeSource]), AccountModule],
  controllers: [IncomeController],
  providers: [IncomeSourceService, IncomeService],
  exports: [],
})
export default class IncomeModule {}
