import { Inject, Injectable, Logger } from '@nestjs/common';
import { IWorkspaceService } from '../interface/IWorkspaceService';
import type { IWorkspaceRepository } from '../interface/IWorkspaceRepository';
import { CreateWorkspaceDto } from '../dto/req/CreateWorkspaceDto';
import { WorkspaceResponseDto } from '../dto/res/WorkspaceResponseDto';
import { Types } from 'mongoose';
import { WorkspaceMapper } from './Mapper/workspace.mapper';

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
    const userWorkspaces = await this._workspaceRepository.findByOwner(userId);
    return userWorkspaces.map((ws) => WorkspaceMapper.toResponseDto(ws));
  }
}
