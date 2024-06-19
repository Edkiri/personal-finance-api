import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/users/services/user.service';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async login(data: LoginDto): Promise<{ access_token: string }> {
    const user = await this.userService.findByEmail(data.email);
    const validPassword = bcrypt.compareSync(data.password, user.password);
    if (!user || !validPassword) {
      throw new UnauthorizedException();
    }
    return {
      access_token: await this.jwtService.signAsync({ userId: user.id }),
    };
  }
}
