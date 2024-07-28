import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';

@Table({
  tableName: 'income_sources',
  timestamps: false,
})
export class IncomeSource extends Model {
  @Column
  name: string;

  @Column
  description: string;

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
