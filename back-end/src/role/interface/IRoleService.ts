import { CreateRoleDTO } from '@/role/dto/CreateRoleDTO';
import { UpdateRoleDTO } from '@/role/dto/UpdateRoleDTO';
import { RoleDocument } from '@/role/Model/role.schema';

export interface IRoleService {
  createRole(dto: CreateRoleDTO, userId: string): Promise<RoleDocument | null>;
  getAllRole(): Promise<RoleDocument[]>;
  updateRole(dto: UpdateRoleDTO): Promise<RoleDocument | null>;
  deleteRole(roleId: string): Promise<void>;
}
