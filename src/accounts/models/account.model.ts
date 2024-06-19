import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Bank } from './bank.model';
import { Currency } from './currency.model';
import { User } from 'src/users/models/user.model';

@Table({
  tableName: 'accounts',
  timestamps: false,
})
export class Account extends Model {
  @Column({ unique: true })
  name: string;

  @Column({ allowNull: true })
  description: string;

  @Column({
    type: 'FLOAT',
    allowNull: false,
    defaultValue: 0,
  })
  amount: number;

  @ForeignKey(() => Bank)
  @Column({ field: 'bank_id' })
  bankId: number;

  @BelongsTo(() => Bank)
  bank: Bank;

  @ForeignKey(() => Currency)
  @Column({ field: 'currency_id' })
  currencyId: number;

  @BelongsTo(() => Currency)
  currency: Currency;

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
