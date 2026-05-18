import { Module } from '@nestjs/common';
import { RedisProvider } from '@/common/redis/redis.provider';
import { TempStoreUserService } from '@/common/temp-store-user/temp-store-user.service';

@Module({
  providers: [
    RedisProvider,
    {
      provide: 'ITempStoreService',
      useClass: TempStoreUserService,
    },
  ],
  exports: ['ITempStoreService'],
})
export class TempStoreUserModule {}
