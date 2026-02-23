import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IWorkspaceService } from '../interface/IWorkspaceService';
import type { IWorkspaceRepository } from '../interface/IWorkspaceRepository';
import { CreateWorkspaceDto } from '../dto/req/CreateWorkspaceDto';
import { WorkspaceResponseDto } from '../dto/res/WorkspaceResponseDto';
import { Types } from 'mongoose';
import { WorkspaceMapper } from './Mapper/workspace.mapper';
import { WORKSPACE_MESSAGE } from 'src/common/constants/messages.constant';

@Injectable()
export class WorkspaceService implements IWorkspaceService {
  constructor(
    @Inject('IWorkspaceRepository')
    private readonly workspaceRepository: IWorkspaceRepository,
  ) {}

  async createWorkspace(
    userId: string,
    dto: CreateWorkspaceDto,
  ): Promise<WorkspaceResponseDto> {
    console.log('USERID:', userId);
    console.log('DTO:', dto);
    const workspace = await this.workspaceRepository.create({
      name: dto.name,
      description: dto.description,
      ownerId: new Types.ObjectId(userId),
      members: [new Types.ObjectId(userId)],
    });
    return WorkspaceMapper.toResponseDto(workspace);
  }

  async getUserWorkspaces(userId: string): Promise<WorkspaceResponseDto[]> {
    const workspace = await this.workspaceRepository.findByOwner(userId);
    return workspace.map((ws) => WorkspaceMapper.toResponseDto(ws));
  }

  async attachSubscription(
    workspaceId: string,
    subscriptionId: string,
  ): Promise<WorkspaceResponseDto> {
    const workspace = await this.workspaceRepository.updateById(workspaceId, {
      subscriptionId: new Types.ObjectId(subscriptionId),
    });
    if (!workspace) {
      throw new NotFoundException(WORKSPACE_MESSAGE.NOT_FOUND);
    }
    return WorkspaceMapper.toResponseDto(workspace);
  }
}
