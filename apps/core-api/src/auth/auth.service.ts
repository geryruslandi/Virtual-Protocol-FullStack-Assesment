import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO, RegisterDTO } from '@api/auth/auth.dto';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '@libs/database';
import { User } from '@libs/database/models/user.model';
import { AppConfigService } from '@libs/app-config';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private config: AppConfigService,
    private jwt: JwtService,
  ) {}

  async registerUser(data: RegisterDTO): Promise<User> {
    const salt = await bcrypt.genSalt(
      parseInt(this.config.get('HASH_SALT_ROUNDS'), 10),
    );

    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await this.db.user.create({
      ...data,
      password: hashedPassword,
    });

    return user;
  }

  async loginUser(data: LoginDTO): Promise<User | null> {
    const user = await this.db.user.findOne({
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
