import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/users/user.module';
import { AccountModule } from 'src/accounts/acount.module';
import ExpenseModule from 'src/expenses/expense.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    UserModule,
    AccountModule,
    ExpenseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
