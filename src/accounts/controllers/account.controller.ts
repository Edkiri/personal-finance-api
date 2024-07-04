import {
  Body,
  Controller,
  Get,
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
    @Body() data: CreateAccountDto,
  ) {
    const userId = Number(request.user.userId);
    await this.accountService.create(userId, data);
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
  }
}
