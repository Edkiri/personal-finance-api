import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExpenseSource } from '../models/expense-source.model';
import {
  CreateExpenseSourceDto,
  UpdateExpenseSourceDto,
} from '../dtos/expenses';

@Injectable()
export class ExpenseSourceService {
  constructor(
    @InjectModel(ExpenseSource)
    private readonly expenseSourceModel: typeof ExpenseSource,
  ) {}

  public async findByNameOrCreate(
    userId: number,
    name: string,
  ): Promise<ExpenseSource> {
    const expenseSource = await this.expenseSourceModel.findOne({
      where: { name, userId },
    });

    if (expenseSource) return expenseSource;

    return this.expenseSourceModel.create({ name, userId });
  }

  public async findAll(userId: number): Promise<ExpenseSource[]> {
    return this.expenseSourceModel.findAll({
      where: { userId },
      order: [['id', 'ASC']],
    });
  }

  public async create(userId: number, data: CreateExpenseSourceDto) {
    await this.expenseSourceModel.create({
      userId,
      name: data.name,
      description: data.description ?? null,
    });
  }

  public findById(expenseSourceId: number): Promise<ExpenseSource | null> {
    return this.expenseSourceModel.findByPk(expenseSourceId);
  }

  public async update(expenseSourceId: number, data: UpdateExpenseSourceDto) {
    const expenseSource = await this.findById(expenseSourceId);
    if (!expenseSource) throw new NotFoundException('Expense source not found');

    if (data.name !== undefined) {
      expenseSource.name = data.name;
    }

    if (data.description !== undefined) {
      expenseSource.description = data.description;
    }

    return expenseSource.save();
  }

  public async delete(expenseSourceId: number): Promise<void> {
    const expenseSource = await this.findById(expenseSourceId);
    if (!expenseSource) throw new NotFoundException('Expense source not found');
    try {
      await expenseSource.destroy();
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new ConflictException(
          'Cannot delete expense source due to associated records',
        );
      } else {
        throw new InternalServerErrorException(
          'Failed to delete expense source',
        );
      }
    }
  }
}
