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
  getProjectsByWorkspace(workspaceId: string): Promise<ProjectDocument[]> {
    return this._ProjectModal.find({
      workspaceId: new Types.ObjectId(workspaceId),
    });
  }
  async findAllProjects(
    page: number,
    limit: number,
    workspaceId: string,
    search?: string,
  ): Promise<{ projects: ProjectDocument[]; total: number }> {
    const filter = {
      workspaceId: new Types.ObjectId(workspaceId),
      ...(search && {
        $or: [
          { projectName: { $regex: search, $options: 'i' } },
          { key: { $regex: search, $options: 'i' } },
        ],
      }),
    };
    const [projects, total] = await Promise.all([
      this._ProjectModal
        .find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),

      this._ProjectModal.countDocuments(filter),
    ]);

    return { projects, total };
  }
  async incrementIssueCounter(projectId: string): Promise<number> {
    const project = await this._ProjectModal.findByIdAndUpdate(
      new Types.ObjectId(projectId),
      { $inc: { issueCounter: 1 } },
      { new: true },
    );
    if (!project) {
      throw new Error('Project not found');
    }
    return project.issueCounter;
  }
}
