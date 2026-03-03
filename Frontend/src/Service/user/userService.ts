
import { AxiosInstance } from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";

interface updateProfilePayload {
  firstName: string;
  lastName: string;
  phone: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UploadAvatarResponse {
  message: string;
  avatarKey: string;
}

export interface CreateWorkspacePayload {
  name: string;
  description?: string;
}

export interface CreateSubscriptionPayload {
  planId: string;
  workspaceId: string;
}

export interface CreateCheckoutPayload {
  planId: string;
  subscriptionId: string;
}

export interface InviteMemberPayload {
  workspaceId: string;
  email: string;
  name: string;
}

export interface completeProfilePayload {
  firstName: string;
  lastName: string;
  password: string;
}

export const updateProfile = async (data: updateProfilePayload) => {
  const response = await AxiosInstance.patch(
    API_ROUTES.USER.UPDATE_PROFILE,
    data,
  );
  return response.data;
};

export const changePassword = async (data: ChangePasswordPayload) => {
  const response = await AxiosInstance.patch(
    API_ROUTES.USER.CHANGE_PASSWORD,
    data,
  );
  return response.data;
};

export const uploadAvatar = async (
  file: File,
): Promise<UploadAvatarResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("source", "profile");
  const response = await AxiosInstance.patch(
    API_ROUTES.USER.UPLOAD_AVATAR,
    formData,
  );
  return response.data;
};

export const getProfile = async () => {
  const response = await AxiosInstance.get(API_ROUTES.USER.GET_PROFILE);
  return response.data;
};

export const createWorkspace = async (data: CreateWorkspacePayload) => {
  const response = await AxiosInstance.post(API_ROUTES.WORKSPACE.CREATE, data);
  return response.data;
};

export const getUserWorkspaces = async () => {
  const response = await AxiosInstance.get(API_ROUTES.WORKSPACE.GETWORKSPACE);
  return response.data;
};

export const getActivePlans = async () => {
  const response = await AxiosInstance.get(API_ROUTES.SUBSCRIPTION.GET_PLANS);
  return response.data;
};

export const createSubscription = async (data: CreateSubscriptionPayload) => {
  const response = await AxiosInstance.post(
    API_ROUTES.SUBSCRIPTION.CREATE,
    data,
  );
  return response.data;
};

export const createCheckoutSession = async (data: CreateCheckoutPayload) => {
  const response = await AxiosInstance.post(API_ROUTES.PAYMENT.CHECKOUT, data);
  return response.data;
};

export const confirmPayment = async (sessionId: string) => {
  const response = await AxiosInstance.post(API_ROUTES.PAYMENT.CONFIRM, {
    sessionId,
  });
  return response.data;
};

export const inviteMembers = async (data: InviteMemberPayload) => {
  const response = await AxiosInstance.post(
    API_ROUTES.INVITATION.INVITE_MEMBER.replace(
      ":workspaceId",
      data.workspaceId,
    ),
    { email: data.email, name: data.name },
  );

  return response.data;
};

export const acceptInvite = async (token: string) => {
  const response = await AxiosInstance.post(
    API_ROUTES.INVITATION.ACCEPT_INVITATION.replace(":token", token),
  );

  return response.data;
};

export const completeProfile = async ( token: string,data: completeProfilePayload) => {
  const response = await AxiosInstance.post(
    API_ROUTES.INVITATION.COMPLETEPROFILE.replace(":token",token),data
  );
  return response.data
};
