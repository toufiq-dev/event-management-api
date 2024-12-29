import { Module } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { RegistrationController } from './registration.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [RegistrationController],
  providers: [RegistrationService],
})
export class RegistrationModule {}
