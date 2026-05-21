import { AxiosInstance } from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";

export interface UserDashboardData {
  projectHeader: {
    projectName: string;
    key: string;
    description?: string;
    startDate: string;
    endDate: string;
    status: "On Track" | "In Progress" | "At Risk";
    owner: {
      id: string;
      name: string;
    };
    updatedAt: string;
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
    issuesCompleted: number;
    totalIssuesAssigned: number;
    percentage: number;
  };
  timeSpentByTeam: {
    name: string;
    hours: number;
    issuesCompleted: number;
    avatar: string;
    role: string;
  }[];
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
  epicsOverview: {
    id: string;
    title: string;
    completedIssues: number;
    totalIssues: number;
    percentage: number;
    status: "On Track" | "In Progress" | "At Risk";
  }[];
}

export const getUserDashboardData = async (projectId: string): Promise<{ data: UserDashboardData }> => {
  const response = await AxiosInstance.get(
    API_ROUTES.DASHBOARD.GET_USER_DASHBOARD.replace(":projectId", projectId)
  );
  return response.data;
};
