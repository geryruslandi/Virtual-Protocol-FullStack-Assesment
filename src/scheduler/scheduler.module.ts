import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MatchCandidate } from '@src/models/match-candidate';
import { User } from '@src/models/user.model';
import { MatchesCandidateGenerator } from '@src/scheduler/mathes-candidate-generator.service';

@Module({
  imports: [SequelizeModule.forFeature([User, MatchCandidate])],
  providers: [MatchesCandidateGenerator],
})
export class SchedulerModule {}
