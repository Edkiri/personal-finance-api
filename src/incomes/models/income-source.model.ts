import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'income_sources',
  timestamps: false,
})
export class IncomeSource extends Model {
  @Column
  name: string;

  @Column
  description: string;
}
