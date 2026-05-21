import { AddAttachmentDTO } from '@/issue/dto/req/AttachmentDTO';
import { CreateIssueDTO } from '@/issue/dto/req/CreateIssueDTO';
import { UpdateIssueDTO } from '@/issue/dto/req/UpdateIssueDTO';
import { IssueResponse } from '@/issue/dto/res/IssueResponse';

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
  deleteAttachment(
    issueId: string,
    attachmentKey: string,
    userId: string,
  ): Promise<IssueResponse>;
  getAttachmentUrl(
    issueId: string,
    attachmentKey: string,
    userId: string,
  ): Promise<{ url: string }>;
}
