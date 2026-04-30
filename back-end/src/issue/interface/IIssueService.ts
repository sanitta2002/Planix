import { AddAttachmentDTO } from '../dto/req/AttachmentDTO';
import { CreateIssueDTO } from '../dto/req/CreateIssueDTO';
import { UpdateIssueDTO } from '../dto/req/UpdateIssueDTO';
import { IssueResponse } from '../dto/res/IssueResponse';

export interface IIssueService {
  createIssue(dto: CreateIssueDTO, userId: string): Promise<IssueResponse>;
  getIssuesByProject(projectId: string): Promise<IssueResponse[]>;
  updateIssue(
    id: string,
    dto: UpdateIssueDTO,
    userId: string,
  ): Promise<IssueResponse>;
  addAttachments(
    issueId: string,
    dto: AddAttachmentDTO,
    userId: string,
    files?: Express.Multer.File[],
  ): Promise<IssueResponse>;
}
