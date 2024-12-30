import { Controller, Post, Body } from '@nestjs/common';
import { LiveUpdateService } from './live-update.service';

@Controller('websocket-test')
export class WebSocketController {
  constructor(private readonly liveUpdateService: LiveUpdateService) {}

  @Post('broadcast')
  testBroadcast(@Body('message') message: string) {
    this.liveUpdateService.testBroadcast(message);
    return { success: true, message: 'Broadcast sent' };
  }
}
