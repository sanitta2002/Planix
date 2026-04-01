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
import { GetAllProjectsDTO } from '../dto/req/GetAllProjectsDTO';
import { GetAllProjectsResponseDTO } from '../dto/res/GetAllProjectsResponseDTO';

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

  async getAllProjects(
    dto: GetAllProjectsDTO,
  ): Promise<GetAllProjectsResponseDTO> {
    const page = Number(dto.page) || 1;
    const limit = Number(dto.limit) || 10;
    const { projects, total } = await this._projectRepository.findAllProjects(
      page,
      limit,
      dto.workspaceId,
      dto.search,
    );
    const data = await Promise.all(
      projects.map(async (project) => {
        const members = await this._projectMemberRepo.getProjectMembers(
          project._id.toString(),
        );
        this._logger.log(data);
        return {
          ...ProjectMapper.toListItem(project),
          members: members.map((m) => ({
            user: {
              id: m.userId._id.toString(),
              firstName: m.userId.firstName,
            },
            role: {
              id: m.roleId._id.toString(),
              name: m.roleId.name,
            },
          })),
        };
      }),
    );
    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateProject(
    projectId: string,
    dto: UpdateProjectDto,
  ): Promise<ProjectListItemDto> {
    const existingProject = await this._projectRepository.findById(projectId);

    if (!existingProject) {
      throw new NotFoundException(PROJECT_ERRORS.PROJECT_NOT_FOUND);
    }
    const updateProject = await this._projectRepository.updateById(projectId, {
      projectName: dto.projectName,
      description: dto.description,
    });
    if (!updateProject) {
      throw new NotFoundException(PROJECT_ERRORS.PROJECT_NOT_FOUND);
    }
    if (dto.members) {
      for (const member of dto.members) {
        const exists = await this._projectMemberRepo.findById(member.userId);
        if (!exists) {
          await this._projectMemberRepo.addMembersToProject({
            projectId,
            userId: member.userId,
            roleId: member.roleId,
          });
        }
      }
    }
    return ProjectMapper.toResponse(updateProject);
  }
  async deleteProject(projectId: string): Promise<void> {
    const deletedProject = await this._projectRepository.deleteById(projectId);
    if (!deletedProject) {
      throw new NotFoundException(PROJECT_ERRORS.NO_PROJECTS_FOUND);
    }
  }
  async removeProjectMember(projectId: string, userId: string): Promise<void> {
    const member = await this._projectMemberRepo.findProjectAndUser(
      projectId,
      userId,
    );
    if (!member) {
      throw new NotFoundException('Member not found in project');
    }
    await this._projectMemberRepo.removeMember(projectId, userId);
  }
}
