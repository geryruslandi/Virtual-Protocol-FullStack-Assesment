import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { QUEUE_EVENTS } from '@libs/message-broker/message-broker.enum';
import { GenerateMatchCandidateDTO } from '@libs/message-broker/message-broker.dto';
import { UserCandidatesGeneratorService } from 'apps/queue-worker/src/user-candidates-generator.service';
import { MessageBrokerService } from '@libs/message-broker';
@Controller()
export class QueueWorkerController {
  constructor(
    private readonly candidateGeneratorService: UserCandidatesGeneratorService,
    private readonly messageBroker: MessageBrokerService,
  ) {}

  @EventPattern({ cmd: QUEUE_EVENTS.GENERATE_MATCH_CANDIDATE })
  async generateMatchesCandidates(
    @Payload() data: GenerateMatchCandidateDTO,
    @Ctx() context: RmqContext,
  ) {
    await this.candidateGeneratorService.generate(data.userId);
    this.messageBroker.acknowledgeMessage(context);
  }
}
