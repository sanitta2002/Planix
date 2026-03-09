import { CreateWorkspaceDto } from '../dto/req/CreateWorkspaceDto';
import { WorkspaceMembersResponseDto } from '../dto/res/WorkspaceMembersResponseDto';
import { WorkspaceResponseDto } from '../dto/res/WorkspaceResponseDto';

export interface IWorkspaceService {
  createWorkspace(
    userId: string,
    dto: CreateWorkspaceDto,
  ): Promise<WorkspaceResponseDto>;
  getUserWorkspaces(userId: string): Promise<WorkspaceResponseDto[]>;
  getWorkspaceMembers(
    workspaceId: string,
  ): Promise<WorkspaceMembersResponseDto>;
}
