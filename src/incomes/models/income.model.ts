import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Account } from 'src/accounts/models/account.model';
import { IncomeSource } from './income-source.model';
import { User } from 'src/users/models/user.model';
import { Currency } from 'src/accounts/models/currency.model';

@Table({
  tableName: 'incomes',
  timestamps: false,
})
export class Income extends Model {
  @ForeignKey(() => Account)
  @Column({ field: 'account_id' })
  accountId: number;

  @BelongsTo(() => Account)
  account: Account;

  @ForeignKey(() => Currency)
  @Column({ field: 'currency_id' })
  currencyId: number;

  @BelongsTo(() => Currency)
  currency: Currency;

  @Column({
    type: 'FLOAT',
    allowNull: false,
  })
  amount: number;

  @Column({
    type: 'DATE',
  })
  date: Date;

  @Column({ allowNull: true })
  description: string;

  @ForeignKey(() => IncomeSource)
  @Column({ field: 'income_source_id' })
  incomeSourceId: number;

  @BelongsTo(() => IncomeSource)
  incomeSource: IncomeSource;

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
