import { InjectModel } from '@nestjs/sequelize';
import { Currency } from '../models/currency.model';

export class CurrencyService {
  constructor(
    @InjectModel(Currency) private readonly currencyModel: typeof Currency,
  ) {}

  async findAll(): Promise<Currency[]> {
    return this.currencyModel.findAll();
  }
}
