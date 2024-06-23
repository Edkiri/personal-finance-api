import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UserService } from './services/user.service';
import { UserProfile } from './models/profile.model';
import { UserController } from './controllers/user.controller';
import { AccountModule } from 'src/accounts/acount.module';

@Module({
  imports: [SequelizeModule.forFeature([User, UserProfile])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
