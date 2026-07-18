import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { FindEntriesQueryDto, UpsertHabitEntryDto } from '../dtos/habit.dto';
import { HabitEntry } from '../models/habit-entry.model';
import { Habit } from '../models/habit.model';

// The cycle's day boundary lives in the user's wall clock, not the server's
// (the VPS runs UTC — same reason the ntfy crontab pins CRON_TZ).
const TIMEZONE = 'Europe/Madrid';

// 'en-CA' formats as YYYY-MM-DD, matching how DATEONLY columns round-trip.
function today(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

// Day arithmetic done in UTC so no local offset can shift the calendar date.
function addDays(date: string, days: number): string {
  const [year, month, day] = date.split('-').map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day));
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return shifted.toISOString().slice(0, 10);
}

export interface HabitSummary {
  habitId: number;
  startDate: string;
  endDate: string | null;
  daysRegistered: number;
  daysDone: number;
  currentStreak: number;
  longestStreak: number;
}

@Injectable()
export class HabitEntryService {
  constructor(
    @InjectModel(HabitEntry)
    private readonly habitEntryModel: typeof HabitEntry,
  ) {}

  /**
   * Marking today and editing today's note are the same idempotent write —
   * that is what keeps logging a one-tap gesture. The UNIQUE (habit_id, date)
   * constraint backs it.
   */
  public async upsert(
    transaction: Transaction,
    userId: number,
    habitId: number,
    data: UpsertHabitEntryDto,
  ): Promise<HabitEntry> {
    const existing = await this.habitEntryModel.findOne({
      where: { habitId, date: data.date },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!existing) {
      return this.habitEntryModel.create(
        {
          habitId,
          userId,
          date: data.date,
          done: data.done,
          note: data.note ?? null,
        },
        { transaction },
      );
    }

    existing.done = data.done;
    // Omitting `note` preserves what is already written; sending null clears it.
    if (data.note !== undefined) {
      existing.note = data.note;
    }

    return existing.save({ transaction });
  }

  public async findByHabitId(
    habitId: number,
    query: FindEntriesQueryDto = {},
  ): Promise<HabitEntry[]> {
    const where: any = { habitId };

    if (query.dateFrom !== undefined && query.dateTo !== undefined) {
      where.date = { [Op.between]: [query.dateFrom, query.dateTo] };
    } else if (query.dateFrom !== undefined) {
      where.date = { [Op.gte]: query.dateFrom };
    } else if (query.dateTo !== undefined) {
      where.date = { [Op.lte]: query.dateTo };
    }

    return this.habitEntryModel.findAll({
      where,
      order: [['date', 'ASC']],
    });
  }

  public async summary(habit: Habit): Promise<HabitSummary> {
    const entries = await this.findByHabitId(habit.id);
    const doneDates = new Set(
      entries.filter((entry) => entry.done).map((entry) => entry.date),
    );

    return {
      habitId: habit.id,
      startDate: habit.startDate,
      endDate: habit.endDate ?? null,
      daysRegistered: entries.length,
      daysDone: doneDates.size,
      currentStreak: this.currentStreak(doneDates),
      longestStreak: this.longestStreak(doneDates),
    };
  }

  /**
   * Counts back from today. If today is not logged yet the streak is measured
   * from yesterday, so an unlogged morning does not read as a broken streak.
   */
  private currentStreak(doneDates: Set<string>): number {
    const now = today();
    let cursor = doneDates.has(now) ? now : addDays(now, -1);
    let streak = 0;

    while (doneDates.has(cursor)) {
      streak += 1;
      cursor = addDays(cursor, -1);
    }

    return streak;
  }

  private longestStreak(doneDates: Set<string>): number {
    const sorted = [...doneDates].sort();
    let longest = 0;
    let run = 0;
    let previous: string | null = null;

    for (const date of sorted) {
      run = previous !== null && addDays(previous, 1) === date ? run + 1 : 1;
      longest = Math.max(longest, run);
      previous = date;
    }

    return longest;
  }
}
