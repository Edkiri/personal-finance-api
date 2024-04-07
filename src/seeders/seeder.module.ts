import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { AppSequelizeModule } from 'src/databases/app-sequelize.module';
import ExpenseModule from 'src/expenses/expense.module';

@Module({
  imports: [AppSequelizeModule, ExpenseModule],
  providers: [SeederService],
})
export class SeederModule {}
