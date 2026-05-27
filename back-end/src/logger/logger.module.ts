import { AppLoggerModule } from '@/config/logger';
import { Module } from '@nestjs/common';
import { PinoLoggerAdapter } from './pinoLogger.adapter';

@Module({
  imports: [AppLoggerModule],
  providers: [
    PinoLoggerAdapter,
    {
      provide: 'ILogger',
      useExisting: PinoLoggerAdapter,
    },
  ],

  exports: ['ILogger'],
})
export class LoggerModule {}
