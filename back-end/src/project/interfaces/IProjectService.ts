import { CreateProjectDto } from '@/project/dto/req/CreateProjectDto';
import { GetAllProjectsDTO } from '@/project/dto/req/GetAllProjectsDTO';
import { UpdateProjectDto } from '@/project/dto/req/UpdateProjectDto';
import { GetAllProjectsResponseDTO } from '@/project/dto/res/GetAllProjectsResponseDTO';
import { ProjectListItemDto } from '@/project/dto/res/ProjectListItemDto';
import { ProjectResponseDto } from '@/project/dto/res/ProjectResponseDto';
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
