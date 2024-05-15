import { DatabaseModule } from '@libs/database';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MatchesCandidateGenerator } from '@scheduler/mathes-candidate-generator.service';

@Module({
  imports: [DatabaseModule, ScheduleModule.forRoot()],
  providers: [MatchesCandidateGenerator],
})
export class SchedulerModule {}
