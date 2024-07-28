import { Model, Column, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';

@Table({
  tableName: 'expense_sources',
  timestamps: false,
})
export class ExpenseSource extends Model {
  @Column
  name: string;

  @Column({ allowNull: true })
  description: string;

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
