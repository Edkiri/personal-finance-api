import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'banks',
  timestamps: false,
})
export class Bank extends Model {
  @Column({ unique: true })
  name: string;

  @Column({ allowNull: true })
  description: string;
}
