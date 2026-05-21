import { useQuery } from "@tanstack/react-query";
import { getUserDashboardData } from "../../Service/dashboard/dashboardService";

export const useGetUserDashboard = (projectId: string) => {
  return useQuery({
    queryKey: ["user-dashboard", projectId],
    queryFn: () => getUserDashboardData(projectId),
    enabled: !!projectId,
  });
};
