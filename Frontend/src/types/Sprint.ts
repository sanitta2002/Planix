export enum SprintStatus {
  PLANNED = 'PLANNED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export interface ISprint {
  _id: string;
  workspaceId: string;
  projectId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  goal?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSprintProps {
  projectId: string;
  workspaceId: string;
  name: string;
  startDate: null;
  endDate: null;
  goal?: string;
}

export interface UpdateSprintProps {
  name?: string;
  startDate?: string;
  endDate?: string;
  goal?: string;
  status?: SprintStatus;
}
