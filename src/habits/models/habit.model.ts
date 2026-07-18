import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { HabitEntry } from './habit-entry.model';

@Table({
  tableName: 'habits',
  timestamps: false,
})
export class Habit extends Model {
  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: true })
  description: string;

  // DATEONLY: a habit lives on calendar days, not instants. Sequelize gives
  // these back as 'YYYY-MM-DD' strings, which is exactly what we want.
  @Column({
    type: DataType.DATEONLY,
    field: 'start_date',
    allowNull: false,
  })
  startDate: string;

  @Column({
    type: DataType.DATEONLY,
    field: 'end_date',
    allowNull: true,
  })
  endDate: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  active: boolean;

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => HabitEntry)
  entries: HabitEntry[];
}
