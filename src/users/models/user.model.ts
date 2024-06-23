import { DataTypes } from 'sequelize';
import { Column, HasOne, Model, Table } from 'sequelize-typescript';
import { UserProfile } from './profile.model';

@Table({
  tableName: 'users',
  timestamps: false,
})
export class User extends Model {
  @Column({
    type: DataTypes.STRING,
    unique: true,
    validate: {
      len: [4, 24],
    },
  })
  username: string;

  @Column({
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email: string;

  @Column({
    type: DataTypes.STRING,
    validate: {
      min: {
        args: [8],
        msg: 'Password must be greater than 8',
      },
    },
  })
  password: string;

  @HasOne(() => UserProfile)
  profile: UserProfile;
}
