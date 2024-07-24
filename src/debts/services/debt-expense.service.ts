import { InjectModel } from '@nestjs/sequelize';
import { DebtExpense } from '../models/debt-expense.mode';
import { ExpenseService } from 'src/expenses/services/expense.service';
import { DebtService } from './debt.service';
import { PayDebtDto } from '../dtos/debt-expense';
import { Sequelize } from 'sequelize-typescript';
import { NotFoundException } from '@nestjs/common';
import { Transaction } from 'sequelize';
import Decimal from 'decimal.js';

export class DebtExpenseService {
  constructor(
    @InjectModel(DebtExpense)
    private readonly debtExpenseModel: typeof DebtExpense,
    private readonly expenseService: ExpenseService,
    private readonly debtService: DebtService,
    private readonly sequelize: Sequelize,
  ) {}

  // create a expense with the debt expense_source
  async payDebt(
    transaction: Transaction,
    userId: number,
    data: PayDebtDto,
  ): Promise<void> {
    const debt = await this.debtService.findById(data.debtId);

    if (!debt) {
      throw new NotFoundException('debt not found');
    }

    const expense = await this.expenseService.create(transaction, userId, {
      accountId: data.accountId,
      amount: data.amount,
      expenseSourceName: debt.expenseSource.name,
      date: new Date(),
    });

    await this.debtExpenseModel.create(
      {
        amount: data.amount,
        expenseId: expense.id,
        debtId: debt.id,
        date: new Date(),
      },
      { transaction },
    );

    const amount = new Decimal(data.amount);
    const totalPaid = new Decimal(debt.totalPaid);
    const debtAmount = new Decimal(debt.amount);

    const updatedTotalPaid = totalPaid.plus(amount);
    debt.totalPaid = updatedTotalPaid.toNumber();

    const diff = debtAmount.minus(updatedTotalPaid);

    if (diff.abs().lessThanOrEqualTo(new Decimal(0.01))) {
      debt.paid = true;
      debt.paidDate = new Date();
    }
    await debt.save({ transaction });
  }
}
