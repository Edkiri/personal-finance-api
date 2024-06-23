import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: 'user_profiles',
  timestamps: false,
})
export class UserProfile extends Model {
  @ForeignKey(() => User)
  @Column({
    field: 'user_id',
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  onboarded: boolean;
}
