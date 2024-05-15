import { Global, Module } from '@nestjs/common';
import { ResponseService } from '@api/utils/response.service';

@Global()
@Module({
  providers: [ResponseService],
  exports: [ResponseService],
})
export class UtilsModule {}
