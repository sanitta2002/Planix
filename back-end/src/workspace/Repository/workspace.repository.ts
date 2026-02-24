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
    private readonly workSpaceModel: Model<WorkspaceDocument>,
  ) {
    super(workSpaceModel);
  }
  async findByOwner(userId: string): Promise<WorkspaceDocument[]> {
    return await this.workSpaceModel.find({
      ownerId: new Types.ObjectId(userId),
      isDeleted: false,
    });
  }
}
