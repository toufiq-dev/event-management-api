import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [EventModule, DbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
