import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'currencies',
  timestamps: false,
})
export class Currency extends Model {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  symbol: string;
}
