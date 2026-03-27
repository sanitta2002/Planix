import { Types } from 'mongoose';
import { CreateProjectDto } from 'src/project/dto/req/CreateProjectDto';
import { ProjectListItemDto } from 'src/project/dto/res/ProjectListItemDto';
import { ProjectResponseDto } from 'src/project/dto/res/ProjectResponseDto';
import { ProjectDocument } from 'src/project/Model/project.schema';

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
    };
  }
  static toProjectListResponse(
    projects: ProjectDocument[],
  ): ProjectListItemDto[] {
    return projects.map((project) => ({
      id: project._id.toString(),
      projectName: project.projectName,
      key: project.key,
      description: project.description,
      workspaceId: project.workspaceId.toString(),
      createdBy: project.createdBy.toString(),
    }));
  }
}
