import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { MatchCandidate } from '@src/models/match-candidate';
import { User } from '@src/models/user.model';

// @ts-expect-error typing error from the library it self
import * as similarity from 'compute-cosine-similarity';
import * as moment from 'moment';
import sequelize from 'sequelize';

@Injectable()
export class MatchesCandidateGenerator {
  private weightConfig = {
    location: 1,
    university: 1,
    interests: 1,
  };

  private usersPerBatch = 50;
  private matchesCandidatesPerProces = 100;
  private matchedUserCount = 10;

  constructor(
    config: ConfigService<ConfigType>,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(MatchCandidate)
    private matchCandidateModel: typeof MatchCandidate,
  ) {
    this.weightConfig.location = parseFloat(
      config.get('MATCHES_WEIGHT_LOCATION'),
    );
    this.weightConfig.university = parseFloat(
      config.get('MATCHES_WEIGHT_UNIVERSITY'),
    );
    this.weightConfig.interests = parseFloat(
      config.get('MATCHES_WEIGHT_INTERESTS'),
    );

    setTimeout(() => {
      this.populateMatches();
    }, 2000);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async populateMatches() {
    const usersTotal = await this.userModel.count();

    if (usersTotal === 0) {
      return;
    }

    const batches = Math.ceil(usersTotal / this.usersPerBatch);

    for (let batch = 1; batch <= batches; batch++) {
      await this.processGeneration(batch);
    }
  }

  async processGeneration(batch: number) {
    const users = await this.userModel.findAll({
      limit: this.usersPerBatch,
      offset: (batch - 1) * this.usersPerBatch,
    });

    await Promise.all(
      users.map((item) => this.searchAndPopulateForMatchesCandidate(item)),
    );
  }

  async searchAndPopulateForMatchesCandidate(user: User) {
    const today = moment().format('DD-MM-YYYY');
    const candidates = await this.userModel.findAll({
      where: {
        gender: user.getOppositeGender(),
      },
      order: [
        sequelize.literal(`
          case
            when university = '${user.university}' then 0
            else random()
          end
        `),
      ],
      limit: this.matchesCandidatesPerProces,
    });

    // collect all of interests
    const interests = Object.keys(
      [...candidates, user].reduce((prev, curr) => {
        const interestObject = curr.interests.reduce((prev, curr) => {
          return {
            ...prev,
            [curr]: true,
          };
        }, {});
        return {
          ...prev,
          ...interestObject,
        };
      }, {}),
    );

    const userMatric = interests.map((item) =>
      user.interests.includes(item) ? 1 : 0,
    );

    const calculatedCandidates = candidates.map((candidate) => {
      const candidateMatric = interests.map((item) =>
        candidate.interests.includes(item) ? 1 : 0,
      );

      const interestScore =
        (similarity(userMatric, candidateMatric) || 0) *
        this.weightConfig.interests;

      const universityScore =
        candidate.university === user.university
          ? this.weightConfig.university
          : 0;

      return {
        user: candidate,
        score: interestScore + universityScore,
      };
    });

    const sorted = calculatedCandidates.sort((a, b) =>
      a.score > b.score ? -1 : 1,
    );

    const currentBestCandidates = sorted.slice(0, this.matchedUserCount);

    const storePromises = currentBestCandidates.map((item) => {
      return this.matchCandidateModel.create({
        user_id: user.id,
        candidate_id: item.user.id,
        score: item.score,
        date: today,
      });
    });

    await Promise.all(storePromises);
  }
}
