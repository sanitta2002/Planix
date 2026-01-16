import { Injectable } from '@nestjs/common';
import { BaseRepository } from './BaseRepo/BaseRepo';
import { User } from '../Models/user.schema';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor(@InjectModel(User.name) userModel: Model<User>) {
    super(userModel);
  }
  async findByEmail(email: string): Promise<User | null> {
    return await this.model.findOne({ email });
  }
  async blockUser(id: string): Promise<User | null> {
    return await this.updateById(id, { isBlocked: true });
  }
  async unblockUser(id: string): Promise<User | null> {
    return this.updateById(id, { isBlocked: false });
  }
}
