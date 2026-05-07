export interface IssueResponse {
  id: string;
  projectId: string;
  workspaceId: string;
  parentId?: string | null;
  title: string;
  description?: string | null;
  status: string;
  type: string;
  issueType: string;
  key: string;
  assigneeId?: string | null;
  sprintId?: string | null;
  createdAt: Date;
  startDate?: Date | null;
  endDate?: Date | null;
}
