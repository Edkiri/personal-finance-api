import { DataTypes } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Currency } from './currency.model';
import { User } from 'src/users/models/user.model';

@Table({
  tableName: 'accounts',
  timestamps: false,
})
export class Account extends Model {
  @Column({ unique: true })
  name: string;

  @Column({
    type: 'FLOAT',
    allowNull: false,
    defaultValue: 0,
  })
  amount: number;

  @Column({ type: DataTypes.STRING, allowNull: false })
  bank: string;

  @Column({ type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_default' })
  isDefault: boolean;

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
