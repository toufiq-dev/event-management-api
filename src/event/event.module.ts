import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { DbModule } from 'src/db/db.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [DbModule, CacheModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
