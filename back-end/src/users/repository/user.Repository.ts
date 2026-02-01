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
  async updateByEmail(
    email: string,
    data: Partial<User>,
  ): Promise<void | null> {
    return await this.model.findOneAndUpdate(
      { email },
      { $set: data },
      { new: true },
    );
  }
  async getAllUsers(): Promise<User[]> {
    return await this.model.find().sort({ createdAt: -1 });
  }
  async findUsersWithPagination(
    page: number,
    limit: number,
    search?: string,
    isBlocked?: boolean,
  ): Promise<{ users: User[]; total: number }> {
    let filter = {};

    if (search) {
      filter = {
        ...filter,
        $or: [
          { email: { $regex: search, $options: 'i' } },
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
        ],
      };
    }

    if (isBlocked !== undefined) {
      filter = {
        ...filter,
        isBlocked,
      };
    }

    const [users, total] = await Promise.all([
      this.model
        .find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.model.countDocuments(filter),
    ]);

    return { users, total };
  }
  async blockUser(id: string): Promise<User | null> {
    return await this.model.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true },
    );
  }
  async unblockUser(id: string): Promise<User | null> {
    return this.model.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true },
    );
  }
}
