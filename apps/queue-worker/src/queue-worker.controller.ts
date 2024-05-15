import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { QUEUE_EVENTS } from '@libs/message-broker/message-broker.enum';
import { GenerateMatchCandidateDTO } from '@libs/message-broker/message-broker.dto';
import { UserCandidatesGeneratorService } from 'apps/queue-worker/src/user-candidates-generator.service';
@Controller()
export class QueueWorkerController {
  constructor(
    private readonly candidateGeneratorService: UserCandidatesGeneratorService,
  ) {}

  @EventPattern({ cmd: QUEUE_EVENTS.GENERATE_MATCH_CANDIDATE })
  generateMatchesCandidates(@Payload() data: GenerateMatchCandidateDTO) {
    this.candidateGeneratorService.generate(data.userId);
  }
}
