import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IProjectService } from '../interfaces/IProjectService';
import type { IprojectRepository } from '../interfaces/IProjectRepository';
import { CreateProjectDto } from '../dto/req/CreateProjectDto';
import {
  PROJECT_ERRORS,
  WORKSPACE_MESSAGE,
} from 'src/common/constants/messages.constant';
import type { IWorkspaceRepository } from 'src/workspace/interface/IWorkspaceRepository';
import { ProjectResponseDto } from '../dto/res/ProjectResponseDto';
import { Types } from 'mongoose';
import { ProjectMapper } from './mapper/ProjectMapper';
import { ProjectListItemDto } from '../dto/res/ProjectListItemDto';
import { UpdateProjectDto } from '../dto/req/UpdateProjectDto';
import type { IRoleRepository } from 'src/role/interface/IRoleRepository';
import type { IProjectMemberRepository } from '../interfaces/IProjectMemberRepository';
import { AddProjectMemberDto } from '../dto/req/AddProjectMemberDTO';
import { Permission, ProjectRole } from 'src/common/type/ProjectRole';

@Injectable()
export class ProjectService implements IProjectService {
  private readonly _logger = new Logger(ProjectService.name);
  constructor(
    @Inject('IprojectRepository')
    private readonly _projectRepository: IprojectRepository,
    @Inject('IWorkspaceRepository')
    private readonly _workspaceRepository: IWorkspaceRepository,
    @Inject('IRoleRepository')
    private readonly _roleRepository: IRoleRepository,
    @Inject('IProjectMemberRepository')
    private readonly _projectMemberRepo: IProjectMemberRepository,
  ) {}
  async createProject(
    project: CreateProjectDto,
    workspaceId: string,
    userId: string,
  ): Promise<ProjectResponseDto> {
    this._logger.log('workspaceId :', workspaceId);
    const workspace = await this._workspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw new NotFoundException(WORKSPACE_MESSAGE.NOT_FOUND);
    }
    const existingProject = await this._projectRepository.getProjectByKey(
      workspaceId,
      project.key,
    );
    if (existingProject) {
      throw new ConflictException(PROJECT_ERRORS.PROJECT_ALREADY_EXISTS);
    }
    const createProject = await this._projectRepository.create({
      projectName: project.projectName,
      key: project.key,
      description: project.description,
      workspaceId: new Types.ObjectId(workspaceId),
      createdBy: new Types.ObjectId(userId),
    });

    let projectManagerRole = await this._roleRepository.getRoleByName(
      ProjectRole.PROJECT_MANAGER,
    );
    if (!projectManagerRole) {
      projectManagerRole = await this._roleRepository.create({
        name: ProjectRole.PROJECT_MANAGER,
        permissions: [
          Permission.CREATE_TASK,
          Permission.DELETE_TASK,
          Permission.MANAGE_MEMBERS,
          Permission.UPDATE_TASK,
          Permission.VIEW_PROJECT,
        ],
        createdBy: new Types.ObjectId(userId),
      });
    }
    await this._projectMemberRepo.create({
      projectId: new Types.ObjectId(createProject._id.toString()),
      userId: new Types.ObjectId(userId),
      roleId: new Types.ObjectId(projectManagerRole._id),
    });

    if (project.members && project.members.length > 0) {
      const uniqueMembers = new Map<string, AddProjectMemberDto>();
      console.log('**:', uniqueMembers);
      for (const m of project.members) {
        if (m.userId !== userId) {
          uniqueMembers.set(m.userId, m);
        }
      }
      for (const member of Array.from(uniqueMembers.values())) {
        await this._projectMemberRepo.addMembersToProject({
          projectId: createProject._id.toString(),
          userId: member.userId,
          roleId: member.roleId,
        });
      }
    }

    return ProjectMapper.toResponse(createProject);
  }
  async getAllProject(): Promise<ProjectListItemDto[]> {
    const project = await this._projectRepository.getAllProject();
    return ProjectMapper.toProjectListResponse(project);
  }
  async updateProject(
    projectId: string,
    dto: UpdateProjectDto,
  ): Promise<ProjectListItemDto> {
    const updateProject = await this._projectRepository.updateById(
      projectId,
      dto,
    );
    if (!updateProject) {
      throw new NotFoundException(PROJECT_ERRORS.PROJECT_NOT_FOUND);
    }
    return ProjectMapper.toResponse(updateProject);
  }
  async deleteProject(projectId: string): Promise<void> {
    const deletedProject = await this._projectRepository.deleteById(projectId);
    if (!deletedProject) {
      throw new NotFoundException(PROJECT_ERRORS.NO_PROJECTS_FOUND);
    }
  }
}
