import { CreateProjectDto } from '../dto/req/CreateProjectDto';
import { GetAllProjectsDTO } from '../dto/req/GetAllProjectsDTO';
import { UpdateProjectDto } from '../dto/req/UpdateProjectDto';
import { GetAllProjectsResponseDTO } from '../dto/res/GetAllProjectsResponseDTO';
import { ProjectListItemDto } from '../dto/res/ProjectListItemDto';
import { ProjectResponseDto } from '../dto/res/ProjectResponseDto';
export interface IProjectService {
  createProject(
    project: CreateProjectDto,
    workspaceId: string,
    userId: string,
  ): Promise<ProjectResponseDto>;
  getAllProjects(dto: GetAllProjectsDTO): Promise<GetAllProjectsResponseDTO>;
  updateProject(
    projectId: string,
    dto: UpdateProjectDto,
  ): Promise<ProjectListItemDto>;
  deleteProject(projectId: string): Promise<void>;
  removeProjectMember(projectId: string, userId: string): Promise<void>;
}
