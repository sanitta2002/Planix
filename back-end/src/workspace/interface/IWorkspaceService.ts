import { CreateWorkspaceDto } from '../dto/req/CreateWorkspaceDto';
import { UpdateWorkspaceDto } from '../dto/req/UpdateWorkspaceDto';
import { WorkspaceLogoUploadResponseDto } from '../dto/res/WorkspaceLogoResDto';
import { WorkspaceMembersResponseDto } from '../dto/res/WorkspaceMembersResponseDto';
import { WorkspacePaymentResponseDto } from '../dto/res/WorkspacePaymentResponseDto';
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
