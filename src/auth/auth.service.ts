import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(data: LoginDto): Promise<{ access_token: string }> {
    if (data.password !== process.env.ADMIN_PASSWORD) {
      throw new UnauthorizedException();
    }
    return {
      access_token: await this.jwtService.signAsync({ admin: true }),
    };
  }
}
