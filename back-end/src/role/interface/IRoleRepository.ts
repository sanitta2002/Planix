import { IBaseRepository } from '@/users/interfaces/baseRepo.interface';
import { RoleDocument } from '@/role/Model/role.schema';

export interface IRoleRepository extends IBaseRepository<RoleDocument> {
  getRoleByName(name: string): Promise<RoleDocument | null>;
  getAllRoles(): Promise<RoleDocument[]>;
}
