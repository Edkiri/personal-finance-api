import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IncomeSource } from '../models/income-source.model';

@Injectable()
export class IncomeSourceService {
  constructor(
    @InjectModel(IncomeSource)
    private readonly incomeSourceModel: typeof IncomeSource,
  ) {}

  public async findByNameOrCreate(name: string): Promise<IncomeSource> {
    const incomeSource =
      await this.incomeSourceModel.findOne<IncomeSource | null>({
        where: { name },
      });

    if (incomeSource) return incomeSource;

    return this.incomeSourceModel.create({ name });
  }

  public async findAll(): Promise<IncomeSource[]> {
    return this.incomeSourceModel.findAll();
  }
}
