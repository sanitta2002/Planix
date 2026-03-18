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
  async findByUser(userId: string): Promise<WorkspaceDocument[]> {
    return await this._workSpaceModel
      .find({
        isDeleted: false,
        $or: [
          { ownerId: new Types.ObjectId(userId) },
          { 'members.user': new Types.ObjectId(userId) },
        ],
      })
      .sort({ createdAt: -1 });
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
        $or: [{ name: { $regex: search, $options: 'i' } }],
      };
    }
    const [workspaces, total] = await Promise.all([
      this._workSpaceModel
        .find(filter)
        .populate('ownerId', 'firstName lastName email')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this._workSpaceModel.countDocuments(filter),
    ]);
    return { workspaces, total };
  }
  async findByNameAndOwner(
    name: string,
    ownerId: string,
  ): Promise<WorkspaceDocument | null> {
    return this._workSpaceModel.findOne({
      name: name,
      ownerId: new Types.ObjectId(ownerId),
    });
  }
  async findMembersByWorkspaceId(
    workspaceId: string,
  ): Promise<WorkspaceDocument | null> {
    return await this._workSpaceModel.findById(workspaceId).populate({
      path: 'members.user',
      select: 'firstName lastName email avatarKey',
    });
  }
}
