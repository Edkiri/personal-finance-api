import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { SignupDto } from 'src/auth/dtos/auth.dto';
import * as bcrypt from 'bcrypt';
import { UserProfile } from '../models/profile.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(UserProfile) private readonly profileModel: typeof UserProfile,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async create(data: SignupDto): Promise<User | null> {
    const emailTaken = await this.findByEmail(data.email);
    if (emailTaken) {
      throw new BadRequestException('Email already taken');
    }

    const user = await this.userModel.create({
      username: data.username,
      password: bcrypt.hashSync(data.password, 10),
      email: data.email,
    });

    await this.profileModel.create({
      userId: user.id,
    });

    return user;
  }

  async getUserProfile(userId: number): Promise<User | null> {
    const user = await this.userModel.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [UserProfile],
    });
    return user ? user.toJSON() : null;
  }
}
