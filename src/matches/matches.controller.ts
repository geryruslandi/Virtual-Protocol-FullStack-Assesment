import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@src/auth/jwt.guard';
import { CurrentUser } from '@src/auth/user.decorator';
import { SwipeDTO } from '@src/matches/matches.dto';
import { MatchesService } from '@src/matches/matches.service';
import { User } from '@src/models/user.model';
import { ResponseService } from '@src/utils/response.service';

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
