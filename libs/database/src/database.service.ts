import { MatchCandidate } from '@libs/database/models/match-candidate';
import { User } from '@libs/database/models/user.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel(User)
    public user: typeof User,
    @InjectModel(MatchCandidate)
    public matchCandidate: typeof MatchCandidate,
  ) {}
}
