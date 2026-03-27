import { CreateProjectDto } from '../dto/req/CreateProjectDto';
import { UpdateProjectDto } from '../dto/req/UpdateProjectDto';
import { ProjectListItemDto } from '../dto/res/ProjectListItemDto';
import { ProjectResponseDto } from '../dto/res/ProjectResponseDto';
export interface IProjectService {
  createProject(
    project: CreateProjectDto,
    workspaceId: string,
    userId: string,
  ): Promise<ProjectResponseDto>;
  getAllProject(): Promise<ProjectListItemDto[]>;
  updateProject(
    projectId: string,
    dto: UpdateProjectDto,
  ): Promise<ProjectListItemDto>;
  deleteProject(projectId: string): Promise<void>;
}
