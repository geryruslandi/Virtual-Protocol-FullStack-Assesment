import { Module } from '@nestjs/common';
import { MatchesService } from '@src/matches/matches.service';
import { MatchesController } from './matches.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@src/models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [MatchesService],
  controllers: [MatchesController],
})
export class MatchesModule {}
