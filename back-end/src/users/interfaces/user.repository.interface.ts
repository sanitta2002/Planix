import { User } from '../Models/user.schema';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  blockUser(id: string): Promise<User | null>;
  unblockUser(id: string): Promise<User | null>;
}
