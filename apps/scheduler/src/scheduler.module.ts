import { AppConfigModule } from '@libs/app-config';
import { DatabaseModule } from '@libs/database';
import { MessageBrokerModule } from '@libs/message-broker';
import {
  QUEUE_NAMES,
  QUEUE_SERVICES,
} from '@libs/message-broker/message-broker.enum';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CandidateGenerator } from '@scheduler/candidate-generator.service';

@Module({
  imports: [
    DatabaseModule,
    AppConfigModule,
    ScheduleModule.forRoot(),
    MessageBrokerModule.register(
      QUEUE_SERVICES.SCHEDULER,
      QUEUE_NAMES.CANDIDATE_GENERATOR_QUEUE,
    ),
  ],
  providers: [CandidateGenerator],
})
export class SchedulerModule {}
