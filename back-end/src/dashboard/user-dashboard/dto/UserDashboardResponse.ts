export interface IUserDashboardResponse {
  projectHeader: {
    projectName: string;
    key: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    owner: {
      id: string;
      name: string;
    };
    updatedAt: Date;
  };

  metrics: {
    totalIssues: number;
    openEpics: number;
    completedIssues: number;
    completedPercentage: number;
    activeSprints: number;
  };

  overallProgress: {
    completedCount: number;
    totalCount: number;
    percentage: number;
    description: string;
  };

  myProgress: {
    name: string;
    role: string;
    avatar: string;
    remainingHours: number;
    issuesCompleted: number;
    totalIssuesAssigned: number;
    percentage: number;
  };

  timeSpentByTeam: Array<{
    id: string;
    name: string;
    remainingHours: number;
    issuesCompleted: number;
    avatar: string;
    role: string;
  }>;

  topPerformer: {
    name: string;
    role: string;
    avatar?: string;
    issuesCompleted: number;
    avgCycleTime: number;
  } | null;

  issuesByType: {
    epic: number;
    story: number;
    task: number;
    bug: number;
    subtask: number;
  };

  issueStatusDistribution: {
    todo: { count: number; percentage: number };
    inProgress: { count: number; percentage: number };
    done: { count: number; percentage: number };
    review: { count: number; percentage: number };
  };

  currentSprint: {
    sprintId: string;
    sprintName: string;
    startDate: string;
    endDate: string;
    daysRemaining: number;
    completedCount: number;
    totalCount: number;
    percentage: number;
    statusBreakdown: {
      todo: number;
      inProgress: number;
      review: number;
      done: number;
    };
  } | null;

  epicsOverview: Array<{
    id: string;
    title: string;
    completedIssues: number;
    totalIssues: number;
    percentage: number;
    status: 'On Track' | 'In Progress' | 'At Risk';
  }>;
}
