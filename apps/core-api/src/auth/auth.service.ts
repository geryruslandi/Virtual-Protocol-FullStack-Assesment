import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO, RegisterDTO } from '@api/auth/auth.dto';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '@libs/database';
import { User } from '@libs/database/models/user.model';
import { AppConfigService } from '@libs/app-config';
import {
  QUEUE_EVENTS,
  QUEUE_SERVICES,
} from '@libs/message-broker/message-broker.enum';
import { ClientProxy } from '@nestjs/microservices';
import { GenerateMatchCandidateDTO } from '@libs/message-broker/message-broker.dto';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private config: AppConfigService,
    private jwt: JwtService,
    @Inject(QUEUE_SERVICES.API)
    private readonly queue: ClientProxy,
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

    this.queue.emit({ cmd: QUEUE_EVENTS.GENERATE_MATCH_CANDIDATE }, {
      userId: user.id,
    } as GenerateMatchCandidateDTO);

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
