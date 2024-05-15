import { Injectable } from '@nestjs/common';
import { SwipeEnum } from '@src/matches/matches.enum';
import { User } from '@src/models/user.model';
import * as moment from 'moment';

@Injectable()
export class MatchesService {
  async getTodaysMatches(user: User) {
    const today = moment().format('DD-MM-YYYY');
    const matchCandidates = await user.$get('matchCandidates', {
      where: {
        date: today,
        status: 'pending',
      },
      include: ['candidate'],
    });

    return matchCandidates;
  }

  async swipe(user: User, matchId: string, swipe: SwipeEnum) {
    const matches = await user.$get('matchCandidates', {
      where: { id: matchId, status: SwipeEnum.PENDING },
    });

    if (matches.length === 0) {
      return;
    }

    const match = matches[0];

    match.status = swipe;
    await match.save();
  }
}
