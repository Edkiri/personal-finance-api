import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { DebtService } from '../services/debt.service';

@Injectable()
export class IsDebtOwnerGuard implements CanActivate {
  constructor(private readonly debtService: DebtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request;

    const debtId = this.getDebtIdFromRequest(req);
    const debt = await this.debtService.findById(debtId);
    if (!debt) {
      throw new NotFoundException('Debt not found');
    }

    if (req.user.userId !== debt.userId) {
      throw new UnauthorizedException(
        'You have no permissions to perform this action',
      );
    }

    return true;
  }

  private getDebtIdFromRequest(req: Request): number | undefined {
    let debtId: number | undefined;

    debtId = Number(req.params.debtId);
    if (!debtId) {
      debtId = Number(req.body.debtId);
    }

    return debtId;
  }
}
