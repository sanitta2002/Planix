import { User } from '../Models/user.schema';
import { IBaseRepository } from './baseRepo.interface';

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  blockUser(id: string): Promise<User | null>;
  unblockUser(id: string): Promise<User | null>;
  updateByEmail(email:string , data:Partial<User>):Promise<void |null>
}
