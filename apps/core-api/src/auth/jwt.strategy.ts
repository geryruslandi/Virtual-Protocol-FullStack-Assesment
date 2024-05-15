import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '@libs/database';
import { AppConfigService } from '@libs/app-config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private db: DatabaseService,
    config: AppConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_PRIVATE'),
    });
  }

  async validate(payload: { id: number }) {
    const user = await this.db.user.findByPk(payload.id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
