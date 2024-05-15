import { NestFactory } from '@nestjs/core';
import { QueueWorkerModule } from './queue-worker.module';
import { MessageBrokerService } from '@libs/message-broker';
import { QUEUE_NAMES } from '@libs/message-broker/message-broker.enum';

async function bootstrap() {
  const app = await NestFactory.create(QueueWorkerModule);
  const messageBroker = app.get<MessageBrokerService>(MessageBrokerService);

  app.connectMicroservice(
    messageBroker.getRmqOptions(QUEUE_NAMES.CANDIDATE_GENERATOR_QUEUE),
  );

  await app.startAllMicroservices();
}
bootstrap();
