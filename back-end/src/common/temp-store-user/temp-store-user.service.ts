import { Inject, Injectable } from '@nestjs/common';
import { ITempStoreService } from './interface/temp-store.interface';
import Redis from 'ioredis';

@Injectable()
export class TempStoreUserService implements ITempStoreService {
  private readonly TTL = 120;
  constructor(@Inject('REDIS_CLIENT') private redis: Redis) {}
  async set<T>(key: string, value: T): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', this.TTL);
  }
  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }
  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
