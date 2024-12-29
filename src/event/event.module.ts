import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { DbModule } from 'src/db/db.module';
import { CacheModule } from 'src/cache/cache.module';
import { EmailModule } from 'src/email/email.module';
import { EventScheduler } from './event.scheduler';
import { WebSocketModule } from 'src/websocket/websocket.module';

@Module({
  imports: [DbModule, EmailModule, CacheModule, WebSocketModule],
  controllers: [EventController],
  providers: [EventService, EventScheduler],
})
export class EventModule {}
