import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { CreateHabitDto } from '../dtos/habit.dto';
import { Habit } from '../models/habit.model';

@Injectable()
export class HabitService {
  constructor(
    @InjectModel(Habit)
    private readonly habitModel: typeof Habit,
  ) {}

  public async create(
    transaction: Transaction,
    userId: number,
    data: CreateHabitDto,
  ): Promise<Habit> {
    // Habits stack: starting a new one does not retire the ones already
    // running. How many are active at once is the caller's call, not a rule
    // enforced down here.
    return this.habitModel.create(
      {
        userId,
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        active: data.active ?? true,
      },
      { transaction },
    );
  }

  public async findByUserId(userId: number): Promise<Habit[]> {
    return this.habitModel.findAll({
      where: { userId },
      order: [
        ['active', 'DESC'],
        ['start_date', 'DESC'],
      ],
    });
  }

  public async findById(habitId: number): Promise<Habit | null> {
    return this.habitModel.findByPk(habitId);
  }
}
