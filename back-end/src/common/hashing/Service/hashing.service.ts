import { Injectable } from '@nestjs/common';
import { IHashingService } from '../interface/hashing.service.interface';
import { compare, hash } from 'bcrypt';

@Injectable()
export class HashingService implements IHashingService {
  private readonly saltOrRounds = 10;
  async hashPassword(password: string): Promise<string> {
    const hashPassword = await hash(password, this.saltOrRounds);
    return hashPassword;
  }
  async comparePassword(plainText: string, hash: string): Promise<boolean> {
    const comparePassword = await compare(plainText, hash);
    return comparePassword;
  }
}
