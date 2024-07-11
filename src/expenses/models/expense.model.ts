import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Account } from 'src/accounts/models/account.model';
import { ExpenseSource } from './expense-source.model';
import { User } from 'src/users/models/user.model';
import { Currency } from 'src/accounts/models/currency.model';

@Table({
  tableName: 'expenses',
  timestamps: false,
})
export class Expense extends Model {
  @ForeignKey(() => Account)
  @Column({ field: 'account_id' })
  accountId: number;

  @Column({
    type: 'FLOAT',
    allowNull: false,
  })
  @Column
  amount: number;

  @Column({
    type: 'DATE',
  })
  date: Date;

  @Column({ allowNull: true })
  description: string;

  @ForeignKey(() => ExpenseSource)
  @Column({ field: 'expense_source_id' })
  expenseSourceId: number;

  @BelongsTo(() => ExpenseSource)
  expenseSource: ExpenseSource;

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Currency)
  @Column({ field: 'currency_id' })
  currencyId: number;

  @BelongsTo(() => Currency)
  currency: Currency;
}
