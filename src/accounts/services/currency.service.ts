import { InjectModel } from '@nestjs/sequelize';
import { Currency } from '../models/currency.model';
import { UserCurrencies } from '../models/user-currencies.model';

export class CurrencyService {
  constructor(
    @InjectModel(Currency) private readonly currencyModel: typeof Currency,
    @InjectModel(UserCurrencies)
    private readonly userCurrenciesModel: typeof UserCurrencies,
  ) {}

  async findAll(): Promise<Currency[]> {
    return this.currencyModel.findAll();
  }

  async addUserCurrencies(
    userId: number,
    currencyIds: number[],
  ): Promise<void> {
    for await (const currencyId of currencyIds) {
      await this.userCurrenciesModel.create({
        userId,
        currencyId,
      });
    }
  }
}
