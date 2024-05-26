import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';

@Controller('accounts')
@UseGuards(AuthenticatedGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async findAccounts() {
    const accounts = await this.accountService.findAll();
    return accounts.map((account) => account.toJSON());
  }
}
