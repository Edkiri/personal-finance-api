import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { CurrencyService } from '../services/currency.service';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { Request } from 'express';

@Controller('currencies')
@UseGuards(AuthenticatedGuard)
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  async findUserCurrencies(@Req() request: Request) {
    const userId = Number(request.user.userId);
    const currencies = await this.currencyService.findUserCurrencies(userId);
    return currencies.map((currency) => currency.toJSON());
  }

  @Get('all')
  async findCurrencies() {
    const currencies = await this.currencyService.findAll();
    return currencies.map((currency) => currency.toJSON());
  }
}
