import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IOtpService } from './interfaces/otp.service.interface';
import { generateOTP } from './otp.util';
import Redis from 'ioredis';

@Injectable()
export class OtpService implements IOtpService {
  private readonly TTL = 120;
  constructor(@Inject('REDIS_CLIENT') private redis: Redis) {}
  async sendOtp(key: string): Promise<string | null> {
    const otp = generateOTP();
    await this.redis.set(key, otp, 'EX', this.TTL);
    return otp;
  }
  async verifyOtp(key: string, value: string): Promise<void> {
    const storedOtp = await this.redis.get(key);
    if (!storedOtp || storedOtp !== value) {
      throw new UnauthorizedException('invalid or expired otp');
    }
    await this.redis.del(key);
  }
  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
