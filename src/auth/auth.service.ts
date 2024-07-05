import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, OnboardUserDto, SignupDto } from './dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/users/services/user.service';
import { AccountService } from 'src/accounts/services/account.service';
import { CurrencyService } from 'src/accounts/services/currency.service';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly accountService: AccountService,
    private readonly currencyService: CurrencyService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(data: SignupDto): Promise<void> {
    await this.userService.create(data);
  }

  async login(data: LoginDto): Promise<{ access_token: string }> {
    const user = await this.userService.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const validPassword = bcrypt.compareSync(data.password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException();
    }
    return {
      access_token: await this.jwtService.signAsync({ userId: user.id }),
    };
  }

  async onboardUser(userId: number, payload: OnboardUserDto): Promise<void> {
    const userProfile = await this.userService.findById(userId);

    if (userProfile.profile.onboarded) {
      throw new BadRequestException('User is already onboarded');
    }

    for await (const [index, account] of payload.accounts.entries()) {
      if (index === 0) {
        account.isDefault = true;
      }
      await this.accountService.create(userId, account);
    }

    await this.currencyService.addUserCurrencies(userId, payload.currencyIds);

    const user = await this.userService.findById(userId);

    user.profile.onboarded = true;
    await user.profile.save();
  }
}
