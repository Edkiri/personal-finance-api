import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Currency } from 'src/accounts/models/currency.model';
import { ExpenseSource } from 'src/expenses/models/expense-source.model';

@Table({
  tableName: 'debts',
  timestamps: false,
})
export class Debt extends Model {
  @Column({ allowNull: true })
  description?: string;

  @Column
  creditor: string;

  @Column({
    type: 'FLOAT',
    allowNull: false,
  })
  amount: number;

  @Column({
    type: 'BOOLEAN',
    defaultValue: false,
  })
  paid: boolean;

  @Column({
    type: 'DATE',
  })
  date: Date;

  @Column({
    type: 'DATE',
    field: 'paid_date',
  })
  paidDate: Date;

  @ForeignKey(() => Currency)
  @Column({ field: 'currency_id' })
  currencyId: number;

  @BelongsTo(() => Currency)
  currency: Currency;

  @ForeignKey(() => ExpenseSource)
  @Column({ field: 'expense_source_id' })
  expenseSourceId: number;

  @BelongsTo(() => ExpenseSource)
  expenseSource: ExpenseSource;
}
