import { IBaseRepository } from '@/users/interfaces/baseRepo.interface';
import { IssueDocument } from '@/issue/Model/issue.schema';

export interface IIssueRepository extends IBaseRepository<IssueDocument> {
  findByProject(projectId: string): Promise<IssueDocument[]>;
  moveIncompleteIssues(
    sprintId: string,
    newSprintId: string | null,
  ): Promise<void>;
}
