import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@api/auth/jwt.guard';
import { CurrentUser } from '@api/auth/user.decorator';
import { SwipeDTO } from '@api/matches/matches.dto';
import { MatchesService } from '@api/matches/matches.service';
import { ResponseService } from '@api/utils/response.service';
import { User } from '@libs/database/models/user.model';

@UseGuards(JwtAuthGuard)
@Controller('matches')
export class MatchesController {
  constructor(
    private response: ResponseService,
    private service: MatchesService,
  ) {}

  @Get()
  async getDailyMatches(@CurrentUser() user: User) {
    const todaysMatches = await this.service.getTodaysMatches(user);

    return this.response.simpleRes({ matches: todaysMatches });
  }

  @Post(':id/swipe')
  async swipeCandidate(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: SwipeDTO,
  ) {
    await this.service.swipe(user, id, body.status);

    return this.response.simpleRes();
  }
}
