import { IBaseRepository } from '@/users/interfaces/baseRepo.interface';
import { ProjectDocument } from '@/project/Model/project.schema';

export interface IprojectRepository extends IBaseRepository<ProjectDocument> {
  getProjectByKey(
    workspaceId: string,
    key: string,
  ): Promise<ProjectDocument | null>;
  getProjectsByWorkspace(workspaceId: string): Promise<ProjectDocument[]>;
  findAllProjects(
    page: number,
    limit: number,
    workspaceId: string,
    search?: string,
  ): Promise<{ projects: ProjectDocument[]; total: number }>;
  incrementIssueCounter(projectId: string): Promise<number>;
}
