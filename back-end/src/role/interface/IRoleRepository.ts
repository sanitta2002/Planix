import { IBaseRepository } from 'src/users/interfaces/baseRepo.interface';
import { RoleDocument } from '../Model/role.schema';

export interface IRoleRepository extends IBaseRepository<RoleDocument> {
  getRoleByName(name: string): Promise<RoleDocument | null>;
  getAllRoles(): Promise<RoleDocument[]>;
}
