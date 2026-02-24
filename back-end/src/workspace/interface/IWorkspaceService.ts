import { CreateWorkspaceDto } from '../dto/req/CreateWorkspaceDto';
import { WorkspaceResponseDto } from '../dto/res/WorkspaceResponseDto';

export interface IWorkspaceService {
  createWorkspace(
    userId: string,
    dto: CreateWorkspaceDto,
  ): Promise<WorkspaceResponseDto>;
  getUserWorkspaces(userId: string): Promise<WorkspaceResponseDto[]>;
}
