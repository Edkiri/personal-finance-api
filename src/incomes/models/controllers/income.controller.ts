import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { IncomeSourceService } from '../services/income-source.service';
import { CreateIncomeDto } from 'src/incomes/dtos/create-income.dto';
import { IncomeService } from '../services/income.service';

@Controller('incomes')
export class IncomeController {
  constructor(
    private readonly incomeService: IncomeService,
    private readonly incomeSourceService: IncomeSourceService,
  ) {}

  @Get()
  async findIncomes() {
    const incomes = await this.incomeService.find();
    return incomes.map((income) => income.toJSON());
  }

  @Post()
  async createIncome(@Body() data: CreateIncomeDto) {
    await this.incomeService.create(data);
    return;
  }

  @Get('sources')
  async getAllIncomeSources() {
    const incomeSources = await this.incomeSourceService.findAll();
    return incomeSources.map((source) => source.toJSON());
  }

  @Delete(':incomeId')
  @HttpCode(204)
  async deleteIncome(@Param('incomeId', ParseIntPipe) incomeId: number) {
    await this.incomeService.delete(incomeId);
    return;
  }
}
