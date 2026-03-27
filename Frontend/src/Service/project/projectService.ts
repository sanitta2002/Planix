
import { AxiosInstance } from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";

export interface CreateProjectPayload {
  workspaceId: string;
  projectName: string;
  key: string;
  description?: string;
  members?: {
    userId: string;
    roleId: string;
  }[];
}
export interface UpdateProjectPayload {
  projectId: string;
  projectName?: string;
  key?: string;
  description?: string;
}

export interface ProjectResponse {
  _id: string;
  projectName: string;
  key: string;
  description?: string;
  workspaceId: string;
  createdBy: string;
}

export const createProject = async (data: CreateProjectPayload) => {
  const response = await AxiosInstance.post(
    API_ROUTES.PROJECT.CREATE_PROJECT.replace(":workspaceId",data.workspaceId),data
  );
  return response.data;
};

export const getAllProjects = async () => {
  const response = await AxiosInstance.get(API_ROUTES.PROJECT.GET_ALL_PROJECTS);
  return response.data;
};

export const updateProject = async (data: UpdateProjectPayload) => {
  const response = await AxiosInstance.patch(
    API_ROUTES.PROJECT.UPDATE_PROJECT.replace("projectId", data.projectId),
    {
      projectName: data.projectName,
      key: data.key,
      description: data.description,
    },
  );
  return response.data;
};

export const deleteProject = async (projectId: string) => {
  const response = await AxiosInstance.delete(
    API_ROUTES.PROJECT.DELETE_PROJECT.replace("projectId", projectId),
  );
  return response.data;
};
