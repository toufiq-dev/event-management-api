import { Module } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { RegistrationController } from './registration.controller';
import { DbModule } from 'src/db/db.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [DbModule, EmailModule],
  controllers: [RegistrationController],
  providers: [RegistrationService],
})
export class RegistrationModule {}
