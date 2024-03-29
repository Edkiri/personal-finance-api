import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExpenseSource } from '../models/expense-source.model';

@Injectable()
export class ExpenseSourceService {
  constructor(
    @InjectModel(ExpenseSource)
    private readonly expenseSourceModel: typeof ExpenseSource,
  ) {}

  public async findByNameOrCreate(name: string): Promise<ExpenseSource> {
    const expenseSource =
      await this.expenseSourceModel.findOne<ExpenseSource | null>({
        where: { name },
      });

    if (expenseSource) return expenseSource;

    return this.expenseSourceModel.create({ name });
  }

  public async findAll(): Promise<ExpenseSource[]> {
    return this.expenseSourceModel.findAll();
  }
}
