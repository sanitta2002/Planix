import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from 'src/users/repository/BaseRepo/BaseRepo';
import { Workspace, WorkspaceDocument } from '../Model/workspace.schema';
import { IWorkspaceRepository } from '../interface/IWorkspaceRepository';
import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';

@Injectable()
export class WorkspaceRepository
  extends BaseRepository<WorkspaceDocument>
  implements IWorkspaceRepository
{
  constructor(
    @InjectModel(Workspace.name)
    private readonly _workSpaceModel: Model<WorkspaceDocument>,
  ) {
    super(_workSpaceModel);
  }
  async findByOwner(userId: string): Promise<WorkspaceDocument[]> {
    return await this._workSpaceModel.find({
      ownerId: new Types.ObjectId(userId),
      isDeleted: false,
    });
  }

  async findAllWorkspace(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ workspaces: WorkspaceDocument[]; total: number }> {
    let filter = {};
    if (search) {
      filter = {
        ...filter,
        name: { $regex: search, $option: 'i' },
      };
    }
    const [workspaces, total] = await Promise.all([
      this._workSpaceModel
        .find(filter)
        .populate('ownerId', 'firstName lastName email')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createAt: -1 }),
      this._workSpaceModel.countDocuments(filter),
    ]);
    return { workspaces, total };
  }
}
