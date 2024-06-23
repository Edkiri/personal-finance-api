import { Body, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { UserService } from '../services/user.service';
import { Request } from 'express';

@Controller('users')
@UseGuards(AuthenticatedGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Req() request: Request) {
    const userId = request.user.userId;
    const userProfile = await this.userService.getUserProfile(userId);
    return userProfile;
  }
}
