import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AccountService } from '../services/account.service';

@Injectable()
export class IsAccountOwnerGuard implements CanActivate {
  constructor(private readonly accountService: AccountService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request;
    const accountId = Number(req.params.accountId);
    const account = await this.accountService.findById(accountId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    if (account.userId !== req.user.userId) {
      throw new UnauthorizedException(
        'You have no permissions to perform this action',
      );
    }

    return true;
  }
}
