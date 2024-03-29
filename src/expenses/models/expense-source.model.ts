import { Model, Column, Table } from 'sequelize-typescript';

@Table({
  tableName: 'expense_sources',
  timestamps: false,
})
export class ExpenseSource extends Model {
  @Column({ unique: true })
  name: string;

  @Column({ allowNull: true })
  description: string;
}
