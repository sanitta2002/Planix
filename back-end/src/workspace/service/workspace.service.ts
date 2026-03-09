import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IWorkspaceService } from '../interface/IWorkspaceService';
import type { IWorkspaceRepository } from '../interface/IWorkspaceRepository';
import { CreateWorkspaceDto } from '../dto/req/CreateWorkspaceDto';
import { WorkspaceResponseDto } from '../dto/res/WorkspaceResponseDto';
import { Types } from 'mongoose';
import { WorkspaceMapper } from './Mapper/workspace.mapper';
import { WORKSPACE_MESSAGE } from 'src/common/constants/messages.constant';
import { WorkspaceMembersResponseDto } from '../dto/res/WorkspaceMembersResponseDto';
import { PopulatedWorkspaceMember } from 'src/common/type/MemberType';

@Injectable()
export class WorkspaceService implements IWorkspaceService {
  private readonly _logger = new Logger(WorkspaceService.name);
  constructor(
    @Inject('IWorkspaceRepository')
    private readonly _workspaceRepository: IWorkspaceRepository,
  ) {}

  async createWorkspace(
    userId: string,
    dto: CreateWorkspaceDto,
  ): Promise<WorkspaceResponseDto> {
    console.log('USERID:', userId);
    console.log('DTO:', dto);
    this._logger.log(`creating workspace for user: ${userId}`);
    const existingWorkspace =
      await this._workspaceRepository.findByNameAndOwner(dto.name, userId);
    if (existingWorkspace) {
      throw new ConflictException(WORKSPACE_MESSAGE.CONFLICT);
    }
    const createdWorkspace = await this._workspaceRepository.create({
      name: dto.name,
      description: dto.description,
      ownerId: new Types.ObjectId(userId),
      members: [
        {
          user: new Types.ObjectId(userId),
          role: 'owner',
          joinedAt: new Date(),
        },
      ],
      subscriptionStatus: 'pending',
    });
    return WorkspaceMapper.toResponseDto(createdWorkspace);
  }

  async getUserWorkspaces(userId: string): Promise<WorkspaceResponseDto[]> {
    this._logger.log(`fetch workspaces for user: ${userId}`);
    const userWorkspaces = await this._workspaceRepository.findByUser(userId);
    return userWorkspaces.map((ws) => WorkspaceMapper.toResponseDto(ws));
  }

  async getWorkspaceMembers(
    workspaceId: string,
  ): Promise<WorkspaceMembersResponseDto> {
    const workspace =
      await this._workspaceRepository.findMembersByWorkspaceId(workspaceId);
    if (!workspace) {
      throw new NotFoundException(WORKSPACE_MESSAGE.NOT_FOUND);
    }
    const members = (
      workspace.members as unknown as PopulatedWorkspaceMember[]
    ).map((m) => ({
      id: m.user._id.toString(),
      firstName: m.user.firstName,
      lastName: m.user.lastName,
      email: m.user.email,
      role: m.role,
      joinedAt: m.joinedAt,
    }));
    console.log(members);
    return { workspaceId: workspace._id.toString(), members };
  }
}
