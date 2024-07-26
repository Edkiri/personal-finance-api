import { InjectModel } from '@nestjs/sequelize';
import { Debt } from '../models/debt.model';
import { CreateDebtDto } from '../dtos/debts';
import { ExpenseSourceService } from 'src/expenses/services/expense-source.service';
import { ExpenseSource } from 'src/expenses/models/expense-source.model';
import { Currency } from 'src/accounts/models/currency.model';
import { DebtExpense } from '../models/debt-expense.mode';
import { Transaction } from 'sequelize';

export class DebtService {
  constructor(
    @InjectModel(Debt) private readonly debtModel: typeof Debt,
    private readonly expenseSourceService: ExpenseSourceService,
  ) {}

  async create(userId: number, data: CreateDebtDto): Promise<void> {
    const expenseSource = await this.expenseSourceService.findByNameOrCreate(
      data.expenseSourceName,
    );
    await this.debtModel.create({
      userId,
      creditor: data.creditor,
      currencyId: data.currencyId,
      amount: data.amount,
      description: data.description,
      expenseSourceId: expenseSource.id,
      date: data.date,
    });
  }

  async delete(transaction: Transaction, debtId: number): Promise<void> {
    await this.debtModel.destroy({ where: { id: debtId }, transaction });
  }

  async findById(id: number): Promise<Debt | null> {
    const debt = await this.debtModel.findByPk(id, {
      include: [ExpenseSource],
    });
    return debt ?? null;
  }

  async findAll(userId: number): Promise<Debt[]> {
    return this.debtModel.findAll({
      where: { userId },
      include: [ExpenseSource, Currency],
      order: [['id', 'DESC']],
    });
  }
}
