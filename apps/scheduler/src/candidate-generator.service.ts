import { DatabaseService } from '@libs/database';
import { GenerateMatchCandidateDTO } from '@libs/message-broker/message-broker.dto';
import {
  QUEUE_EVENTS,
  QUEUE_SERVICES,
} from '@libs/message-broker/message-broker.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CandidateGenerator {
  private usersPerBatch = 50;

  constructor(
    private db: DatabaseService,
    @Inject(QUEUE_SERVICES.SCHEDULER)
    private readonly queue: ClientProxy,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async populateMatches() {
    const usersTotal = await this.db.user.count();

    if (usersTotal === 0) {
      return;
    }

    const batches = Math.ceil(usersTotal / this.usersPerBatch);

    for (let batch = 1; batch <= batches; batch++) {
      await this.processGeneration(batch);
    }
  }

  async processGeneration(batch: number) {
    const users = await this.db.user.findAll({
      limit: this.usersPerBatch,
      offset: (batch - 1) * this.usersPerBatch,
    });

    users.forEach((item) =>
      this.queue.emit({ cmd: QUEUE_EVENTS.GENERATE_MATCH_CANDIDATE }, {
        userId: item.id,
      } as GenerateMatchCandidateDTO),
    );
  }
}
