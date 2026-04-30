import { Types } from 'mongoose';
import { CreateIssueDTO } from 'src/issue/dto/req/CreateIssueDTO';
import { Issue, IssueDocument } from 'src/issue/Model/issue.schema';

export class IssueMapper {
  static toEntity(dto: CreateIssueDTO, userId: string): Partial<Issue> {
    return {
      title: dto.title,
      description: dto.description,
      issueType: dto.issueType,
      status: dto.status,

      projectId: new Types.ObjectId(dto.projectId),
      workspaceId: new Types.ObjectId(dto.workspaceId),

      parentId: dto.parentId ? new Types.ObjectId(dto.parentId) : null,

      sprintId: dto.sprintId ? new Types.ObjectId(dto.sprintId) : null,

      assigneeId: dto.assigneeId ?? null,
      attachments: dto.attachments || [],
      startDate: dto.startDate,
      endDate: dto.endDate,

      createdBy: userId,
    };
  }

  static toResponse(issue: IssueDocument) {
    return {
      id: issue._id.toString(),
      projectId: issue.projectId.toString(),
      workspaceId: issue.workspaceId.toString(),
      title: issue.title,
      description: issue.description ?? null,
      status: issue.status,
      type: issue.issueType,
      issueType: issue.issueType,
      key: issue.key,
      assigneeId: issue.assigneeId,
      sprintId: issue.sprintId ? issue.sprintId.toString() : null,
      createdAt: issue.createdAt,
      parentId: issue.parentId ? issue.parentId.toString() : null,
      startDate: issue.startDate,
      endDate: issue.endDate,
      attachments: issue.attachments || [],
    };
  }
}
