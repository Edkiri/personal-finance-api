import { Controller, Get } from '@nestjs/common';
import { CurrencyService } from '../services/currency.service';

@Controller('currencies')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  async findCurrencies() {
    const currencies = await this.currencyService.findAll();
    return currencies.map((currency) => currency.toJSON());
  }
}
