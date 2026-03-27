import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AddProjectMemberDto } from 'src/project/dto/req/AddProjectMemberDTO';
import { IProjectMemberRepository } from 'src/project/interfaces/IProjectMemberRepository';
import {
  ProjectMember,
  ProjectMemberDocument,
} from 'src/project/Model/ProjectMember/projectMember.schema';
import { BaseRepository } from 'src/users/repository/BaseRepo/BaseRepo';

@Injectable()
export class ProjectMemberRepository
  extends BaseRepository<ProjectMemberDocument>
  implements IProjectMemberRepository
{
  constructor(
    @InjectModel(ProjectMember.name)
    private readonly _ProjectMemberModal: Model<ProjectMemberDocument>,
  ) {
    super(_ProjectMemberModal);
  }

  async addMembersToProject(
    dto: AddProjectMemberDto,
  ): Promise<ProjectMemberDocument> {
    const { projectId, userId, roleId } = dto;
    const existing = await this._ProjectMemberModal.findOne({
      projectId,
      userId,
    });
    if (existing) {
      throw new ConflictException('User already in project');
    }
    return await this._ProjectMemberModal.create({
      projectId,
      userId,
      roleId,
    });
  }

  async getProjectMembers(projectId: string): Promise<ProjectMemberDocument[]> {
    return await this._ProjectMemberModal.find({
      projectId: new Types.ObjectId(projectId),
    });
  }
  async findProjectAndUser(
    projectId: string,
    userId: string,
  ): Promise<ProjectMemberDocument | null> {
    return await this._ProjectMemberModal.findOne({
      projectId: new Types.ObjectId(projectId),
      userId: new Types.ObjectId(userId),
    });
  }
}
