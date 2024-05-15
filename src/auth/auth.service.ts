import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { LoginDTO, RegisterDTO } from '@src/auth/auth.dto';
import { User } from '@src/models/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private config: ConfigService<ConfigType>,
    private jwt: JwtService,
  ) {}

  async registerUser(data: RegisterDTO): Promise<User> {
    const salt = await bcrypt.genSalt(
      parseInt(this.config.get('HASH_SALT_ROUNDS'), 10),
    );

    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await this.userModel.create({
      ...data,
      password: hashedPassword,
    });

    return user;
  }

  async loginUser(data: LoginDTO): Promise<User | null> {
    const user = await this.userModel.findOne({
      where: {
        username: data.username,
      },
    });

    if (user == null) {
      return null;
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);

    if (!passwordMatch) {
      return null;
    }

    return user;
  }

  generateBearerToken(user: User): Promise<string> {
    return this.jwt.signAsync({ id: user.id });
  }
}
