import { Module } from '@nestjs/common';
import { QueueWorkerController } from './queue-worker.controller';
import { MessageBrokerModule } from '@libs/message-broker';
import {
  QUEUE_NAMES,
  QUEUE_SERVICES,
} from '@libs/message-broker/message-broker.enum';
import { UserCandidatesGeneratorService } from 'apps/queue-worker/src/user-candidates-generator.service';
import { DatabaseModule } from '@libs/database';

@Module({
  imports: [
    MessageBrokerModule.register(
      QUEUE_SERVICES.WORKER,
      QUEUE_NAMES.CANDIDATE_GENERATOR_QUEUE,
    ),
    DatabaseModule,
  ],
  controllers: [QueueWorkerController],
  providers: [UserCandidatesGeneratorService],
})
export class QueueWorkerModule {}
