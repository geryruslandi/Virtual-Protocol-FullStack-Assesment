import { Module } from '@nestjs/common';
import { UtilsModule } from '@api/utils/utils.module';
import { MatchesModule } from '@api/matches/matches.module';
import { DatabaseModule } from '@libs/database';
import { AppConfigModule } from '@libs/app-config';
import { AuthModule } from '@api/auth/auth.module';
import { AppController } from '@api/app.controller';
import { AppService } from '@api/app.service';

@Module({
  imports: [
    AuthModule,
    UtilsModule,
    MatchesModule,
    DatabaseModule,
    AppConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
