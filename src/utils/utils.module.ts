import { Global, Module } from '@nestjs/common';
import { ResponseService } from '@src/utils/response.service';

@Global()
@Module({
  providers: [ResponseService],
  exports: [ResponseService],
})
export class UtilsModule {}
