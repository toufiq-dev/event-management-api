import { Module } from '@nestjs/common';
import { LiveUpdateService } from './live-update.service';

@Module({
  providers: [LiveUpdateService],
  exports: [LiveUpdateService],
})
export class WebSocketModule {}
