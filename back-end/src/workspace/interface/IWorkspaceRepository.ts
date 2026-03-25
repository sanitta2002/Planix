import { IBaseRepository } from 'src/users/interfaces/baseRepo.interface';
import { WorkspaceDocument } from '../Model/workspace.schema';

export interface IWorkspaceRepository extends IBaseRepository<WorkspaceDocument> {
  findByUser(ownerId: string): Promise<WorkspaceDocument[]>;
  findAllWorkspace(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ workspaces: WorkspaceDocument[]; total: number }>;
  findByNameAndOwner(
    name: string,
    ownerId: string,
  ): Promise<WorkspaceDocument | null>;
  findMembersByWorkspaceId(
    workspaceId: string,
  ): Promise<WorkspaceDocument | null>;
}
