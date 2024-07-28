import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IncomeSource } from '../models/income-source.model';

@Injectable()
export class IncomeSourceService {
  constructor(
    @InjectModel(IncomeSource)
    private readonly incomeSourceModel: typeof IncomeSource,
  ) {}

  public async findByNameOrCreate(
    userId: number,
    name: string,
  ): Promise<IncomeSource> {
    const incomeSource =
      await this.incomeSourceModel.findOne<IncomeSource | null>({
        where: { name, userId },
      });

    if (incomeSource) return incomeSource;

    return this.incomeSourceModel.create({ name });
  }

  public async findAll(userId: number): Promise<IncomeSource[]> {
    return this.incomeSourceModel.findAll({ where: { userId } });
  }
}
