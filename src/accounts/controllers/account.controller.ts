import { Controller, Get } from '@nestjs/common';
import { AccountService } from '../services/account.service';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async findAccounts() {
    const accounts = await this.accountService.findAll();
    return accounts.map((account) => account.toJSON());
  }
}
