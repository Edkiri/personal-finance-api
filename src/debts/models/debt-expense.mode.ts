import {
  Table,
  Model,
  ForeignKey,
  Column,
  BelongsTo,
} from 'sequelize-typescript';
import { Expense } from 'src/expenses/models/expense.model';
import { Debt } from './debt.model';

@Table({
  tableName: 'debts_expenses',
  timestamps: false,
})
export class DebtExpense extends Model {
  @Column({
    type: 'FLOAT',
    allowNull: false,
  })
  amount: number;

  @ForeignKey(() => Expense)
  @Column({ field: 'expense_id' })
  expenseId: number;

  @BelongsTo(() => Expense)
  expense: Expense;

  @ForeignKey(() => Debt)
  @Column({ field: 'debt_id' })
  debtId: number;

  @BelongsTo(() => Debt)
  debt: Debt;

  @Column({
    type: 'DATE',
  })
  date: Date;
}
