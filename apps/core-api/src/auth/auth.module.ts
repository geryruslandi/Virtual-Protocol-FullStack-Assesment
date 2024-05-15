import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '@api/auth/jwt.strategy';
import { AppConfigService } from '@libs/app-config';
import { AuthService } from '@api/auth/auth.service';
import { AuthController } from '@api/auth/auth.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: AppConfigService) => ({
        secret: configService.get<string>('JWT_PRIVATE'),
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
