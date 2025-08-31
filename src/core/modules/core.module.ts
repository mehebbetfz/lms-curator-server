import { Global, Module } from '@nestjs/common';
import { CheckAuthorityService } from '../services/check-authority.service';

@Global()
@Module({
  providers: [CheckAuthorityService],
  exports: [CheckAuthorityService],
})
export class CoreModule {}
