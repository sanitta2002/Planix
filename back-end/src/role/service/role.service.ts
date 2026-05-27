import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IRoleService } from '@/role/interface/IRoleService';
import type { IRoleRepository } from '@/role/interface/IRoleRepository';
import { CreateRoleDTO } from '@/role/dto/CreateRoleDTO';
import { RoleDocument } from '@/role/Model/role.schema';
import { ROLE_MESSAGE } from '@/common/constants/messages.constant';
import { UpdateRoleDTO } from '@/role/dto/UpdateRoleDTO';
import { Types } from 'mongoose';
import type { ILogger } from '@/logger/ILogger';

@Injectable()
export class RoleService implements IRoleService {
  constructor(
    @Inject('ILogger')
    private readonly _logger: ILogger,
    @Inject('IRoleRepository')
    private readonly _roleRepository: IRoleRepository,
  ) {}
  async createRole(dto: CreateRoleDTO, userId: string): Promise<RoleDocument> {
    const existingRole = await this._roleRepository.getRoleByName(dto.name);
    if (existingRole) {
      throw new ConflictException(ROLE_MESSAGE.CONFLICT);
    }
    const role = await this._roleRepository.create({
      name: dto.name,
      permissions: dto.permissions,
      createdBy: new Types.ObjectId(userId),
    });
    return role;
  }
  async getAllRole(): Promise<RoleDocument[]> {
    const role = await this._roleRepository.getAllRoles();
    if (!role) {
      throw new NotFoundException(ROLE_MESSAGE.ROLE_FETCHING_FAILED);
    }
    return role;
  }
  async updateRole(dto: UpdateRoleDTO): Promise<RoleDocument | null> {
    const existingRole = await this._roleRepository.findById(dto.roleId);
    if (!existingRole) {
      throw new NotFoundException(ROLE_MESSAGE.ROLE_NOT_FOUND);
    }
    if (!dto.permissions || dto.permissions.length === 0) {
      throw new NotFoundException(ROLE_MESSAGE.PERMISSION_CANNOT_EMPTY);
    }
    if (dto.name && existingRole.name !== dto.name) {
      const duplicate = await this._roleRepository.getRoleByName(dto.name);
      if (duplicate) {
        throw new ConflictException(ROLE_MESSAGE.ROLE_NAME_ALREADY_EXISTS);
      }
    }
    const updateRole = await this._roleRepository.updateById(dto.roleId, dto);
    if (!updateRole) {
      throw new NotFoundException(ROLE_MESSAGE.ROLE_NOT_FOUND);
    }
    return updateRole;
  }
  async deleteRole(roleId: string): Promise<void> {
    const role = await this._roleRepository.findById(roleId);
    console.log('role:', role);
    if (!role) {
      throw new NotFoundException(ROLE_MESSAGE.ROLE_NOT_FOUND);
    }
    const deleted = await this._roleRepository.deleteById(roleId);
    if (!deleted) {
      throw new NotFoundException(ROLE_MESSAGE.ROLE_NOT_FOUND);
    }
  }
}
