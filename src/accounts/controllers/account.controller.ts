import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AccountService } from '../services/account.service';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { CreateAccountDto } from '../dtos/accounts.dto';

@Controller('accounts')
@UseGuards(AuthenticatedGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async findUserAccounts(@Req() request: Request) {
    const userId = Number(request.user.userId);
    const accounts = await this.accountService.findByUserId(userId);
    return accounts.map((account) => account.toJSON());
  }

  @Post()
  async createUserAccount(
    @Req() request: Request, 
    @Body() data: CreateAccountDto
  ) {
    const userId = Number(request.user.userId);
    await this.accountService.create(userId, data);
  }
}
