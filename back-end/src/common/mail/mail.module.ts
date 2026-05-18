import { Module } from '@nestjs/common';
import { MailService } from '@/common/mail/mail.service';

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
