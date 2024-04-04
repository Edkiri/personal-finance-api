import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Income } from './models/income.model';
import { IncomeSource } from './models/income-source.model';
import { AccountModule } from 'src/accounts/acount.module';
import { IncomeSourceService } from './models/services/income-source.service';
import { IncomeController } from './models/controllers/income.controller';
import { IncomeService } from './models/services/income.service';

@Module({
  imports: [SequelizeModule.forFeature([Income, IncomeSource]), AccountModule],
  controllers: [IncomeController],
  providers: [IncomeSourceService, IncomeService],
  exports: [],
})
export default class IncomeModule {}
