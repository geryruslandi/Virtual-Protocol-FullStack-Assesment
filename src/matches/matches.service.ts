import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@src/models/user.model';
import { Op } from 'sequelize';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async getTodaysMatches(user: User) {
    const users = await this.userModel.findAll({
      where: {
        id: {
          [Op.ne]: user.id,
        },
      },
      limit: 10,
    });

    return users;
  }
}
