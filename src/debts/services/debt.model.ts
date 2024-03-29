import { InjectModel } from '@nestjs/sequelize';
import { Debt } from '../models/debt.model';
import { CreateDebtDto } from '../dtos/debts';
import { ExpenseSourceService } from 'src/expenses/services/expense-source.service';
import { ExpenseSource } from 'src/expenses/models/expense-source.model';

export class DebtService {
  constructor(
    @InjectModel(Debt) private readonly debtModel: typeof Debt,
    private readonly expenseSourceService: ExpenseSourceService,
  ) {}

  async create(data: CreateDebtDto): Promise<void> {
    const expenseSource = await this.expenseSourceService.findByNameOrCreate(
      data.expenseSourceName,
    );
    await this.debtModel.create({
      creditor: data.creditor,
      currencyId: data.currencyId,
      amount: data.amount,
      description: data.description,
      expenseSourceId: expenseSource.id,
      date: data.date,
    });
  }

  async findAll(): Promise<Debt[]> {
    return this.debtModel.findAll({ include: [ExpenseSource] });
  }
}
