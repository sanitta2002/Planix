import { AxiosInstance } from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";

interface adminLoginPayload {
  email: string;
  password: string;
}

export interface GetUsersPayload {
  page?: number;
  limit?: number;
  search?: string;
  isBlocked?: boolean;
}

interface blockUserPayload {
  userId: string;
}

export interface CreatePlanPayload {
  name: string;
  price: number;
  maxMembers?: number;
  maxProjects?: number;
  features: string[];
  storage?: number;
  isActive?: boolean;
}
export interface UpdatePlanPayload {
 name?: string;
  price?: number;
  maxMembers?: number;
  maxProjects?: number;
  storage?: number;
  features?: string[];
  isActive?: boolean;
}

export const adminLogin = async (data: adminLoginPayload) => {
  const response = await AxiosInstance.post(API_ROUTES.Admin.LOGIN, data);
  return response.data;
};

export const getUsers = async (params: GetUsersPayload) => {
  const response = await AxiosInstance.get(API_ROUTES.Admin.GETUSERS, {
    params,
  });
  return response.data;
};

export const blockUser = async ({ userId }: blockUserPayload) => {
  const response = await AxiosInstance.patch(
    `${API_ROUTES.Admin.BASE}/${userId}/block`,
    { userId },
  );
  return response.data;
};

export const unblockUser = async ({ userId }: blockUserPayload) => {
  const response = await AxiosInstance.patch(
    `${API_ROUTES.Admin.BASE}/${userId}/unblock`,
    { userId },
  );
  return response.data;
};

export const createPlan = async (data: CreatePlanPayload) => {
  const response = await AxiosInstance.post(
    API_ROUTES.Admin.SUBSCRIPTION_PLAN,
    data,
  );
  return response.data;
};

export const getPlans = async () => {
  const response = await AxiosInstance.get(API_ROUTES.Admin.SUBSCRIPTION_PLAN);
  return response.data;
};

export const updatePlan = async (planId: string, data: UpdatePlanPayload) => {
  const response = await AxiosInstance.patch(
    `${API_ROUTES.Admin.SUBSCRIPTION_PLAN}/${planId}`,
    data,
  );
  return response.data;
};

export const deletePlan = async (planId: string) => {
  const response = await AxiosInstance.delete(
    `${API_ROUTES.Admin.SUBSCRIPTION_PLAN}/${planId}`,
  );
  return response.data;
};
