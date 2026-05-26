import { Module } from '@nestjs/common';
import { OtpService } from '@/common/otp/otp.service';
import { RedisModule } from '@/common/redis/redis.module';

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
