import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrencyService } from '../services/currency.service';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';

@Controller('currencies')
@UseGuards(AuthenticatedGuard)
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  async findCurrencies() {
    const currencies = await this.currencyService.findAll();
    return currencies.map((currency) => currency.toJSON());
  }
}
