import { ConfigType } from '@libs/app-config/app-config.type';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private config: ConfigService<ConfigType>) {}

  get<T>(key: keyof ConfigType) {
    return this.config.get<T>(key);
  }
}
