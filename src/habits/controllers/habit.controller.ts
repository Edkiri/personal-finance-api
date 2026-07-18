import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Sequelize } from 'sequelize-typescript';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import {
  CreateHabitDto,
  FindEntriesQueryDto,
  UpsertHabitEntryDto,
} from '../dtos/habit.dto';
import { IsHabitOwnerGuard } from '../guards/is-habit-owner.guard';
import { HabitEntryService } from '../services/habit-entry.service';
import { HabitService } from '../services/habit.service';

@Controller('habits')
@UseGuards(AuthenticatedGuard)
export class HabitController {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly habitService: HabitService,
    private readonly habitEntryService: HabitEntryService,
  ) {}

  @Get()
  async findHabits(@Req() req: Request) {
    const userId = req.user.userId;
    const habits = await this.habitService.findByUserId(userId);
    return habits.map((habit) => habit.toJSON());
  }

  @Post()
  @HttpCode(201)
  async createHabit(@Req() req: Request, @Body() data: CreateHabitDto) {
    const habit = await this.sequelize.transaction(async (transaction) => {
      const userId = req.user.userId;
      return this.habitService.create(transaction, userId, data);
    });

    return habit.toJSON();
  }

  @Get(':habitId')
  @UseGuards(IsHabitOwnerGuard)
  async getHabitDetail(@Param('habitId', ParseIntPipe) habitId: number) {
    const habit = await this.habitService.findById(habitId);
    return habit.toJSON();
  }

  @Get(':habitId/entries')
  @UseGuards(IsHabitOwnerGuard)
  async getHabitEntries(
    @Param('habitId', ParseIntPipe) habitId: number,
    @Query() query: FindEntriesQueryDto,
  ) {
    const entries = await this.habitEntryService.findByHabitId(habitId, query);
    return entries.map((entry) => entry.toJSON());
  }

  @Put(':habitId/entries')
  @UseGuards(IsHabitOwnerGuard)
  async upsertHabitEntry(
    @Req() req: Request,
    @Param('habitId', ParseIntPipe) habitId: number,
    @Body() data: UpsertHabitEntryDto,
  ) {
    const entry = await this.sequelize.transaction(async (transaction) => {
      const userId = req.user.userId;
      return this.habitEntryService.upsert(transaction, userId, habitId, data);
    });

    return entry.toJSON();
  }

  @Get(':habitId/summary')
  @UseGuards(IsHabitOwnerGuard)
  async getHabitSummary(@Param('habitId', ParseIntPipe) habitId: number) {
    const habit = await this.habitService.findById(habitId);
    return this.habitEntryService.summary(habit);
  }
}
