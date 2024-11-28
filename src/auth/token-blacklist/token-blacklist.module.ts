import { Global, Module } from '@nestjs/common';
import { TokenBlacklistService } from './token-blacklist.service';

@Global() // Make this module global
@Module({
  providers: [TokenBlacklistService],
  exports: [TokenBlacklistService],
})
export class TokenBlacklistModule {}