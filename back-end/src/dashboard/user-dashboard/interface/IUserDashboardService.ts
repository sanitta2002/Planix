import { IUserDashboardResponse } from '../dto/UserDashboardResponse';

export interface IUserDashboardService {
  getDashboardData(
    projectId: string,
    loggedInUserId: string,
  ): Promise<IUserDashboardResponse>;
}
