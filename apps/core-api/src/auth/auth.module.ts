import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '@api/auth/jwt.strategy';
import { AppConfigService } from '@libs/app-config';
import { AuthService } from '@api/auth/auth.service';
import { AuthController } from '@api/auth/auth.controller';
import { MessageBrokerModule } from '@libs/message-broker';
import {
  QUEUE_NAMES,
  QUEUE_SERVICES,
} from '@libs/message-broker/message-broker.enum';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: AppConfigService) => ({
        secret: configService.get<string>('JWT_PRIVATE'),
      }),
    }),
    MessageBrokerModule.register(
      QUEUE_SERVICES.API,
      QUEUE_NAMES.CANDIDATE_GENERATOR_QUEUE,
    ),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
