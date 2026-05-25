import { Types } from 'mongoose';
import { CreateProjectDto } from '@/project/dto/req/CreateProjectDto';
import { ProjectListItemDto } from '@/project/dto/res/ProjectListItemDto';
import { ProjectResponseDto } from '@/project/dto/res/ProjectResponseDto';
import { ProjectDocument } from '@/project/Model/project.schema';

export class ProjectMapper {
  static toEntity(
    dto: CreateProjectDto,
    workspaceId: string,
    userId: string,
  ): Partial<ProjectDocument> {
    return {
      projectName: dto.projectName,
      key: dto.key,
      description: dto.description,
      workspaceId: new Types.ObjectId(workspaceId),
      createdBy: new Types.ObjectId(userId),
      issueCounter: 0,
    };
  }
  static toResponse(project: ProjectDocument): ProjectResponseDto {
    return {
      id: project._id.toString(),
      projectName: project.projectName,
      key: project.key,
      description: project.description,
      workspaceId: project.workspaceId.toString(),
      createdBy: project.createdBy.toString(),
      createdAt: project.createdAt,
    };
  }
  static toListItem(project: ProjectDocument): ProjectListItemDto {
    return {
      id: project._id.toString(),
      projectName: project.projectName,
      key: project.key,
      description: project.description,
      workspaceId: project.workspaceId.toString(),
      createdBy: project.createdBy.toString(),
      createdAt: project.createdAt,
    };
  }
}
