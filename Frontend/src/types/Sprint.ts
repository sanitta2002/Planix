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

export interface BurndownTrendPoint {
  day: string;
  idealPoints: number;
  actualPoints: number;
  idealHours: number;
  actualHours: number;
}

export interface BurndownResponse {
  sprintId: string;
  sprintName: string;
  totalPoints: number;
  completedPoints: number;
  remainingPoints: number;
  totalHours: number;
  completedHours: number;
  remainingHours: number;
  trendData: BurndownTrendPoint[];
}
