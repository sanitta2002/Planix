import { AxiosInstance } from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type { CreateSprintProps, ISprint, UpdateSprintProps } from "../../types/Sprint";

export const createSprint = async (data: CreateSprintProps): Promise<ISprint> => {
  const response = await AxiosInstance.post(API_ROUTES.SPRINT.CREATE, data);
  return response.data;
};

export const getSprintsByProject = async (projectId: string): Promise<ISprint[]> => {
  const response = await AxiosInstance.get(API_ROUTES.SPRINT.GET_BY_PROJECT.replace(":projectId", projectId));
  return response.data;
};

export const startSprint = async (sprintId: string, data: UpdateSprintProps): Promise<ISprint> => {
  const response = await AxiosInstance.patch(API_ROUTES.SPRINT.START_SPRINT.replace(":id", sprintId), data);
  return response.data;
};

export const completeSprint = async (sprintId: string, moveToSprintId?: string): Promise<ISprint> => {
  const response = await AxiosInstance.patch(API_ROUTES.SPRINT.COMPLETE_SPRINT.replace(":id", sprintId), {
    moveToSprintId
  });
  return response.data;
};


