import { BaseRepository } from 'src/users/repository/BaseRepo/BaseRepo';
import { Role, RoleDocument } from '../Model/role.schema';
import { IRoleRepository } from '../interface/IRoleRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleRepository
  extends BaseRepository<RoleDocument>
  implements IRoleRepository
{
  constructor(
    @InjectModel(Role.name) private readonly _RoleModel: Model<RoleDocument>,
  ) {
    super(_RoleModel);
  }
  async getRoleByName(name: string): Promise<RoleDocument | null> {
    return await this._RoleModel.findOne({ name });
  }
  async getAllRoles(): Promise<RoleDocument[]> {
    return await this._RoleModel.find();
  }
}
