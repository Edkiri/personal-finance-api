import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserModule } from 'src/users/user.module';
import { HabitController } from './controllers/habit.controller';
import { HabitEntry } from './models/habit-entry.model';
import { Habit } from './models/habit.model';
import { HabitEntryService } from './services/habit-entry.service';
import { HabitService } from './services/habit.service';

@Module({
  imports: [SequelizeModule.forFeature([Habit, HabitEntry]), UserModule],
  controllers: [HabitController],
  providers: [HabitService, HabitEntryService],
  exports: [],
})
export default class HabitModule {}
