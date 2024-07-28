import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { UserCurrencies } from './user-currencies.model';

@Table({
  tableName: 'currencies',
  timestamps: false,
})
export class Currency extends Model {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  symbol: string;

  @BelongsToMany(() => User, () => UserCurrencies)
  users: User[];
}
