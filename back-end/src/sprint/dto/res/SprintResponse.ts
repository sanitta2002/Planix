export interface SprintResponse {
  _id: string;
  projectId: string;
  workspaceId: string;
  name: string;
  goal?: string;
  status: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}
