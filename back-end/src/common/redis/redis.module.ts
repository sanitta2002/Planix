import { Module } from '@nestjs/common';
import { RedisProvider } from '@/common/redis/redis.provider';

@Module({
  providers: [RedisProvider],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
