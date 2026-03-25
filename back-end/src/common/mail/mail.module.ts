import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [
    {
      provide: 'IMailService',
      useClass: MailService,
    },
  ],
  exports: ['IMailService'],
})
export class MailModule {}
