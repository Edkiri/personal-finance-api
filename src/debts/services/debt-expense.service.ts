import { InjectModel } from '@nestjs/sequelize';
import { DebtExpense } from '../models/debt-expense.mode';
import { ExpenseService } from 'src/expenses/services/expense.service';
import { DebtService } from './debt.service';
import { PayDebtDto } from '../dtos/debt-expense';
import { NotFoundException } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { add, subtract } from 'src/utils';
import Decimal from 'decimal.js';

export class DebtExpenseService {
  constructor(
    @InjectModel(DebtExpense)
    private readonly debtExpenseModel: typeof DebtExpense,
    private readonly expenseService: ExpenseService,
    private readonly debtService: DebtService,
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

    const updatedTotalPaid = add(debt.totalPaid, data.amount);

    debt.totalPaid = updatedTotalPaid;

    const diff = new Decimal(subtract(debt.amount, updatedTotalPaid));

    if (diff.abs().lessThanOrEqualTo(new Decimal(0.01))) {
      debt.paid = true;
      debt.paidDate = new Date();
    }
    await debt.save({ transaction });
  }

  async findByExpenseId(expenseId: number): Promise<DebtExpense | null> {
    return this.debtExpenseModel.findOne({ where: { expenseId } });
  }

  async removePayDebt(
    transaction: Transaction,
    debtExpenseId: number,
  ): Promise<void> {
    const debtExpense = await this.debtExpenseModel.findByPk(debtExpenseId);
    const debt = await this.debtService.findById(debtExpense.debtId);

    const updatedTotalPaid = subtract(debt.totalPaid, debtExpense.amount);

    debt.totalPaid = updatedTotalPaid;

    const diff = new Decimal(subtract(debt.amount, updatedTotalPaid));

    if (diff.abs().lessThanOrEqualTo(new Decimal(0.01))) {
      debt.paid = true;
      debt.paidDate = new Date();
    } else {
      debt.paid = false;
      debt.paidDate = null;
    }

    await this.debtExpenseModel.destroy({
      where: { id: debtExpenseId },
      transaction,
    });

    await debt.save({ transaction });
  }

  async updatePayDebtAmount(
    transaction: Transaction,
    debtExpenseId: number,
    newAmount: number,
  ): Promise<void> {
    const debtExpense = await this.debtExpenseModel.findByPk(debtExpenseId);
    const debt = await this.debtService.findById(debtExpense.debtId);

    const amountDifference = subtract(newAmount, debtExpense.amount);

    debtExpense.amount = newAmount;

    await debtExpense.save({ transaction });

    debt.totalPaid = add(debt.totalPaid, amountDifference);

    const remainingAmount = new Decimal(subtract(debt.amount, debt.totalPaid));

    if (remainingAmount.abs().lessThanOrEqualTo(new Decimal(0.01))) {
      debt.paid = true;
      debt.paidDate = new Date();
    } else {
      debt.paid = false;
      debt.paidDate = null;
    }

    await debt.save({ transaction });
  }
}
