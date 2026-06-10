import { CreateWorkspaceDto } from '@/workspace/dto/req/CreateWorkspaceDto';
import { UpdateWorkspaceDto } from '@/workspace/dto/req/UpdateWorkspaceDto';
import { WorkspaceLogoUploadResponseDto } from '@/workspace/dto/res/WorkspaceLogoResDto';
import { WorkspaceMembersResponseDto } from '@/workspace/dto/res/WorkspaceMembersResponseDto';
import { WorkspacePaymentResponseDto } from '@/workspace/dto/res/WorkspacePaymentResponseDto';
import { WorkspaceResponseDto } from '@/workspace/dto/res/WorkspaceResponseDto';

export interface IWorkspaceService {
  createWorkspace(
    userId: string,
    dto: CreateWorkspaceDto,
  ): Promise<WorkspaceResponseDto>;
  getUserWorkspaces(
    userId: string,
    search?: string,
  ): Promise<WorkspaceResponseDto[]>;
  getWorkspaceMembers(
    workspaceId: string,
  ): Promise<WorkspaceMembersResponseDto>;
  removeMember(workspaceId: string, memberId: string): Promise<void>;
  updateWorkspace(
    workspaceId: string,
    userId: string,
    dto: UpdateWorkspaceDto,
  ): Promise<WorkspaceResponseDto>;
  uploadWorkspaceLogo(
    workspaceId: string,
    userId: string,
    file: Express.Multer.File,
  ): Promise<WorkspaceLogoUploadResponseDto>;
  getWorkspaceProfile(workspaceId: string): Promise<WorkspaceResponseDto>;
  getWorkspacePaymentDetails(
    workspaceId: string,
    userId: string,
  ): Promise<WorkspacePaymentResponseDto[]>;
}
