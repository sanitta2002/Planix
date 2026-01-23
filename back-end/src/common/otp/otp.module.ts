import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [
    {
      provide: 'IOtpService',
      useClass: OtpService,
    },
  ],
  exports: ['IOtpService'],
})
export class OtpModule {}
