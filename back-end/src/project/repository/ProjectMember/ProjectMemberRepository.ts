import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PopulatedProjectMember } from 'src/common/type/Populated';
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
    return await this._ProjectMemberModal.findOneAndUpdate(
      {
        projectId: new Types.ObjectId(projectId),
        userId: new Types.ObjectId(userId),
      },
      {
        roleId: new Types.ObjectId(roleId),
      },
      {
        upsert: true,
        new: true,
      },
    );
    return await this._ProjectMemberModal.create({
      projectId,
      userId,
      roleId,
    });
  }

  async getProjectMembers(
    projectId: string,
  ): Promise<PopulatedProjectMember[]> {
    return await this._ProjectMemberModal
      .find({
        projectId: new Types.ObjectId(projectId),
      })
      .populate('userId', 'firstName')
      .populate('roleId', 'name')
      .lean<PopulatedProjectMember[]>();
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
  async removeMember(projectId: string, userId: string) {
    return this._ProjectMemberModal.deleteOne({
      projectId: new Types.ObjectId(projectId),
      userId: new Types.ObjectId(userId),
    });
  }
}
