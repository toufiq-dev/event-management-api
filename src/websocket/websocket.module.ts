import { Module } from '@nestjs/common';
import { LiveUpdateService } from './live-update.service';
import { WebSocketController } from './websocket.controller';

@Module({
  controllers: [WebSocketController],
  providers: [LiveUpdateService],
  exports: [LiveUpdateService],
})
export class WebSocketModule {}
