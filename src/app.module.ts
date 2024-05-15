import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@src/models/user.model';
import { UtilsModule } from '@src/utils/utils.module';
import { MatchesModule } from '@src/matches/matches.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from '@src/scheduler/scheduler.module';
import { MatchCandidate } from '@src/models/match-candidate';

@Module({
  imports: [
    AuthModule,
    UtilsModule,
    MatchesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigType>) => ({
        dialect: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        models: [User, MatchCandidate],
      }),
    }),
    ScheduleModule.forRoot(),
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
