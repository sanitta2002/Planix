import { Inject, Injectable, Logger } from '@nestjs/common';
import { IWorkspaceService } from '../interface/IWorkspaceService';
import type { IWorkspaceRepository } from '../interface/IWorkspaceRepository';
import { CreateWorkspaceDto } from '../dto/req/CreateWorkspaceDto';
import { WorkspaceResponseDto } from '../dto/res/WorkspaceResponseDto';
import { Types } from 'mongoose';
import { WorkspaceMapper } from './Mapper/workspace.mapper';

@Injectable()
export class WorkspaceService implements IWorkspaceService {
  private readonly logger = new Logger(WorkspaceService.name);
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
    this.logger.log(`creating workspace for user: ${userId}`);
    const workspace = await this.workspaceRepository.create({
      name: dto.name,
      description: dto.description,
      ownerId: new Types.ObjectId(userId),
      members: [new Types.ObjectId(userId)],
    });
    return WorkspaceMapper.toResponseDto(workspace);
  }

  async getUserWorkspaces(userId: string): Promise<WorkspaceResponseDto[]> {
    this.logger.log(`fetch workspaces for user: ${userId}`);
    const workspace = await this.workspaceRepository.findByOwner(userId);
    return workspace.map((ws) => WorkspaceMapper.toResponseDto(ws));
  }
}
