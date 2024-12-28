import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { DbModule } from './db/db.module';
import { AttendeeModule } from './attendee/attendee.module';

@Module({
  imports: [EventModule, DbModule, AttendeeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
