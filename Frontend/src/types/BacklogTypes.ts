export interface IssueData {
  id: string;
  _id?: string;
  title: string;
  status: string;
  type?: string;
  issueType?: string;
  key: string;
  assigneeId?: string | null;
  sprintId?: string | null;
  createdAt: string;
  parentId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface ExtendedIssue extends IssueData {
    color?: string;
    progress?: string;
    parentTitle?: string;
    tasks?: ExtendedIssue[];
}
