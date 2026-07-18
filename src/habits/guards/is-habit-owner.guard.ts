import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { HabitService } from '../services/habit.service';

@Injectable()
export class IsHabitOwnerGuard implements CanActivate {
  constructor(private readonly habitService: HabitService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request;

    const habitId = Number(req.params.habitId);
    const habit = await this.habitService.findById(habitId);
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    if (req.user.userId !== habit.userId) {
      throw new UnauthorizedException(
        'You have no permissions to perform this action',
      );
    }

    return true;
  }
}
