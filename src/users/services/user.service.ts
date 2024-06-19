import { Injectable } from "@nestjs/common";
import { User } from "../models/user.model";
import { InjectModel } from "@nestjs/sequelize";


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }
}
