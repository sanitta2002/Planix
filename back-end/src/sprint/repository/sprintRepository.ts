import { InjectModel } from '@nestjs/mongoose';
import { IsprintRepository } from '../interface/IsprintRepository';
import { Sprint, SprintDocument } from '../Model/sprint.schema';
import { Model, Types } from 'mongoose';
import { SprintStatus } from 'src/common/type/SprintStatus';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/users/repository/BaseRepo/BaseRepo';

@Injectable()
export class SprintRepository
  extends BaseRepository<SprintDocument>
  implements IsprintRepository
{
  constructor(
    @InjectModel(Sprint.name)
    private readonly _sprintModel: Model<SprintDocument>,
  ) {
    super(_sprintModel);
  }
  async findByProject(projectId: string): Promise<SprintDocument[]> {
    return await this._sprintModel.find({
      projectId: new Types.ObjectId(projectId),
    });
  }
  async findActiveSprint(projectId: string): Promise<SprintDocument | null> {
    return await this._sprintModel.findOne({
      projectId,
      status: SprintStatus.ACTIVE,
    });
  }
  async findPlannedSprint(projectId: string): Promise<SprintDocument | null> {
    return await this._sprintModel.findOne({
      projectId,
      status: SprintStatus.PLANNED,
    });
  }
}
