import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { UserService } from '../services/user.service';
import { Request } from 'express';
import { OnboardUserDto } from '../dtos/user.dto';

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

  @Post('onboard')
  async onboard(@Req() request: Request, @Body() payload: OnboardUserDto) {
    const userId = request.user.userId;
  }
}
