import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, OnboardUserDto, SignupDto } from './dtos/auth.dto';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  register(@Body() payload: SignupDto) {
    return this.authService.signup(payload);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('onboard')
  onboardUser(@Req() req: Request, @Body() payload: OnboardUserDto) {
    const userId = req.user.userId;
    this.authService.onboardUser(userId, payload);
  }
}
