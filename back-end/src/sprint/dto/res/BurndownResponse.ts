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
