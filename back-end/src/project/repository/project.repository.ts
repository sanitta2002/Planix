import { BaseRepository } from 'src/users/repository/BaseRepo/BaseRepo';
import { Project, ProjectDocument } from '../Model/project.schema';
import { IprojectRepository } from '../interfaces/IProjectRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class ProjectRepository
  extends BaseRepository<ProjectDocument>
  implements IprojectRepository
{
  constructor(
    @InjectModel(Project.name)
    private readonly _ProjectModal: Model<ProjectDocument>,
  ) {
    super(_ProjectModal);
  }
  async getProjectByKey(
    workspaceId: string,
    key: string,
  ): Promise<ProjectDocument | null> {
    return await this._ProjectModal.findOne({
      workspaceId: new Types.ObjectId(workspaceId),
      key: key,
    });
  }
  getAllProject(): Promise<ProjectDocument[]> {
    return this._ProjectModal.find();
  }
}
