import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { IncomeService } from '../services/income.service';

@Injectable()
export class IsIncomeOwner implements CanActivate {
  constructor(private readonly incomeService: IncomeService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request;

    const incomeId = Number(req.params.incomeId);
    const income = await this.incomeService.findById(incomeId);
    if (!income) {
      throw new NotFoundException('Income not found');
    }

    if (req.user.userId !== income.userId) {
      throw new UnauthorizedException(
        'You have no permissions to perform this action',
      );
    }

    return true;
  }
}
