import { InjectModel } from '@nestjs/sequelize';
import { DebtExpense } from '../models/debt-expense.mode';
import { ExpenseService } from 'src/expenses/services/expense.service';
import { DebtService } from './debt.model';
import { PayDebtDto } from '../dtos/debt-expense';
import { Sequelize } from 'sequelize-typescript';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

export class DebtExpenseService {
  constructor(
    @InjectModel(DebtExpense)
    private readonly debtExpenseModel: typeof DebtExpense,
    private readonly expenseService: ExpenseService,
    private readonly debtService: DebtService,
    private readonly sequelize: Sequelize,
  ) {}

  // create a expense with the debt expense_source
  async payDebt(userId: number, data: PayDebtDto): Promise<void> {
    try {
      await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };

        const debt = await this.debtService.findById(data.debtId);
        if (!debt) {
          throw new NotFoundException('debt not found');
        }

        const expense = await this.expenseService.create(userId, {
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
          { transaction: transactionHost.transaction },
        );

        debt.totalPaid = debt.totalPaid + data.amount;

        const diff = debt.amount - debt.totalPaid;
        if (diff < 0.01 && diff > -0.01) {
          debt.paid = true;
          debt.paidDate = new Date();
        }
        await debt.save({ transaction: transactionHost.transaction });
      });
    } catch (err) {
      const errorMessage = err.message || 'internal server error';
      const errorStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(errorMessage, errorStatus);
    }
  }
}
