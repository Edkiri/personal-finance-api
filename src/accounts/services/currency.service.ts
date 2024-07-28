import { InjectModel } from '@nestjs/sequelize';
import { Currency } from '../models/currency.model';
import { UserCurrencies } from '../models/user-currencies.model';
import { Transaction } from 'sequelize';
import { User } from 'src/users/models/user.model';

export class CurrencyService {
  constructor(
    @InjectModel(Currency) private readonly currencyModel: typeof Currency,
    @InjectModel(UserCurrencies)
    private readonly userCurrenciesModel: typeof UserCurrencies,
  ) {}

  async findUserCurrencies(userId: number): Promise<Currency[]> {
    return this.currencyModel.findAll({
      include: [
        {
          model: User,
          where: { id: userId },
          attributes: [],
          through: { attributes: [] },
        },
      ],
    });
  }

  async findAll(): Promise<Currency[]> {
    return this.currencyModel.findAll();
  }

  async addUserCurrencies(
    transaction: Transaction,
    userId: number,
    currencyIds: number[],
  ): Promise<void> {
    for await (const currencyId of currencyIds) {
      await this.userCurrenciesModel.create(
        {
          userId,
          currencyId,
        },
        { transaction },
      );
    }
  }
}
