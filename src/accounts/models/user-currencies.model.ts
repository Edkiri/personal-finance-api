import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { Currency } from './currency.model';

@Table({
  tableName: 'user_currencies',
  timestamps: false,
})
export class UserCurrencies extends Model {
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
