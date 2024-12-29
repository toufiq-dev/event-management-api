import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { DbModule } from './db/db.module';
import { AttendeeModule } from './attendee/attendee.module';
import { RegistrationModule } from './registration/registration.module';
import { CacheModule } from './cache/cache.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WebSocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    EventModule,
    DbModule,
    AttendeeModule,
    RegistrationModule,
    CacheModule,
    EmailModule,
    WebSocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
