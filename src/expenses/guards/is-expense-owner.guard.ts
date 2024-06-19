import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ExpenseService } from '../services/expense.service';

@Injectable()
export class IsExpenseOwnerGuard implements CanActivate {
  constructor(private readonly expenseService: ExpenseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request;

    const expenseId = Number(req.params.expenseId);
    const expense = await this.expenseService.findById(expenseId);
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    if (req.user.userId !== expense.userId) {
      throw new UnauthorizedException(
        'You have no permissions to perform this action',
      );
    }

    return true;
  }
}
