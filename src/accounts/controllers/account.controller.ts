import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AccountService } from '../services/account.service';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { CreateAccountDto, UpdateAccountDto } from '../dtos/accounts.dto';
import { IsAccountOwnerGuard } from '../guards/is-account-owner.guard';
import { Sequelize } from 'sequelize-typescript';
import { ExpenseService } from 'src/expenses/services/expense.service';

@Controller('accounts')
@UseGuards(AuthenticatedGuard)
export class AccountController {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly accountService: AccountService,
    private readonly expenseService: ExpenseService,
  ) {}

  @Get()
  async findUserAccounts(@Req() request: Request) {
    const userId = Number(request.user.userId);
    const accounts = await this.accountService.findByUserId(userId);
    return accounts.map((account) => account.toJSON());
  }

  @Post()
  async createUserAccount(
    @Req() request: Request,
    @Body() data: CreateAccountDto,
  ) {
    await this.sequelize.transaction(async (transaction) => {
      const userId = Number(request.user.userId);
      await this.accountService.create(transaction, userId, data);
    });
    return;
  }

  @Get(':accountId')
  @UseGuards(IsAccountOwnerGuard)
  async getUserAccount(@Param('accountId', ParseIntPipe) accountId: number) {
    const account = await this.accountService.findById(accountId);
    return account.toJSON();
  }

  @Put(':accountId')
  @UseGuards(IsAccountOwnerGuard)
  async updateUserAccount(
    @Param('accountId', ParseIntPipe) accountId: number,
    @Body() data: UpdateAccountDto,
  ) {
    await this.accountService.update(accountId, data);
    return;
  }

  @Delete(':accountId')
  @UseGuards(IsAccountOwnerGuard)
  @HttpCode(204)
  async deleteAccount(
    @Req() request: Request,
    @Param('accountId', ParseIntPipe) accountId: number,
  ) {
    const userId = Number(request.user.userId);
    const expenseCount = await this.expenseService.find(userId, { accountId });
    if (expenseCount.length >= 1) {
      throw new ConflictException('Account not empty');
    }
    await this.accountService.delete(accountId);
    return;
  }
}
