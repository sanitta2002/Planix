import { IBaseRepository } from 'src/users/interfaces/baseRepo.interface';
import { IssueDocument } from '../Model/issue.schema';
import { IssueStatus } from 'src/common/type/IssueStatus';

export interface IIssueRepository extends IBaseRepository<IssueDocument> {
  findByProject(projectId: string): Promise<IssueDocument[]>;
  findByParent(parentId: string): Promise<IssueDocument[]>;
  findByStatus(status: IssueStatus): Promise<IssueDocument[]>;
}
