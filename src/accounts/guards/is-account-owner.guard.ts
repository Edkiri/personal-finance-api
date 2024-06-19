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

    const accountId = this.getAccountIdFromRequest(req);
    if (!accountId) {
      throw new NotFoundException('Account id not found in request');
    } 
    
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

  private getAccountIdFromRequest(req: Request): number | undefined {
    let accountId: number | undefined;
    
    accountId = Number(req.params.accountId);
    if (!accountId) {
      accountId = Number(req.body.accountId);
    }

    return accountId;
  }
}
