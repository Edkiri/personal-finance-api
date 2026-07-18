import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { Habit } from './habit.model';

@Table({
  tableName: 'habit_entries',
  timestamps: false,
})
export class HabitEntry extends Model {
  @ForeignKey(() => Habit)
  @Column({ field: 'habit_id' })
  habitId: number;

  @BelongsTo(() => Habit)
  habit: Habit;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  date: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  done: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  note: string;

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
