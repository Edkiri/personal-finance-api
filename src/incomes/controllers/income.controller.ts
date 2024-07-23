import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IncomeSourceService } from '../services/income-source.service';
import {
  CreateIncomeDto,
  FindIncomeQueryDto,
  UpdateIncomeDto,
} from 'src/incomes/dtos/income.dto';
import { IncomeService } from '../services/income.service';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { IsIncomeOwnerGuard } from '../guards/is-income-owner.guard';
import { IsAccountOwnerGuard } from 'src/accounts/guards/is-account-owner.guard';
import { Request } from 'express';

@Controller('incomes')
@UseGuards(AuthenticatedGuard)
export class IncomeController {
  constructor(
    private readonly incomeService: IncomeService,
    private readonly incomeSourceService: IncomeSourceService,
  ) {}

  @Get()
  async findIncomes(@Req() req: Request, @Query() query: FindIncomeQueryDto) {
    const userId = req.user.userId;
    const incomes = await this.incomeService.findByUserId(userId, query);
    return incomes.map((income) => income.toJSON());
  }

  @Post()
  @UseGuards(IsAccountOwnerGuard)
  async createIncome(@Req() req: Request, @Body() data: CreateIncomeDto) {
    const userId = req.user.userId;
    await this.incomeService.create(userId, data);
    return;
  }

  @Get('sources')
  async getAllIncomeSources() {
    const incomeSources = await this.incomeSourceService.findAll();
    return incomeSources.map((source) => source.toJSON());
  }

  @Get(':incomeId')
  @UseGuards(IsIncomeOwnerGuard)
  async getIncomeDetail(@Param('incomeId', ParseIntPipe) incomeId: number) {
    const income = await this.incomeService.findById(incomeId);
    return income.toJSON();
  }

  @Delete(':incomeId')
  @UseGuards(IsIncomeOwnerGuard)
  @HttpCode(204)
  async deleteIncome(@Param('incomeId', ParseIntPipe) incomeId: number) {
    await this.incomeService.delete(incomeId);
    return;
  }

  @Put(':incomeId')
  @UseGuards(IsIncomeOwnerGuard)
  async updateIncome(
    @Param('incomeId', ParseIntPipe) incomeId: number,
    @Body() data: UpdateIncomeDto,
  ) {
    await this.incomeService.update(incomeId, data);
    return;
  }
}
