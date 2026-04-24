import { IBaseRepository } from 'src/users/interfaces/baseRepo.interface';
import { IssueDocument } from '../Model/issue.schema';

export interface IIssueRepository extends IBaseRepository<IssueDocument> {
  findByProject(projectId: string): Promise<IssueDocument[]>;
  moveIncompleteIssues(
    sprintId: string,
    newSprintId: string | null,
  ): Promise<void>;
}
