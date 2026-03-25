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
  workspaceId: string;
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
interface removeWorkspaceMemberPayload {
  workspaceId: string;
  memberId: string;
}
interface createRolePayload {
  name: string;
  permissions: string[];
}

interface updateRolePayload {
  roleId: string;
  name: string;
  permissions: string[];
}

interface UpdateWorkspacePayload {
  workspaceId: string;
  name?: string;
  description?: string;
}

export interface WorkspacePaymentResponse {
  workspaceId: string;
  plan: string;
  amount: number;
  status: string;
  startDate: string;
  endDate?: string;
}

export interface UpgradeSubscriptionPayload {
  planId: string;
  workspaceId: string;
}

export interface RetryPaymentPayload {
  subscriptionId: string;
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

export const getWorkspaceProfile = async (workspaceId: string) => {
  const response = await AxiosInstance.get(
    API_ROUTES.WORKSPACE.GET_PROFILE.replace(":workspaceId", workspaceId),
  );
  return response.data;
};

export const updateWorkspace = async (data: UpdateWorkspacePayload) => {
  const response = await AxiosInstance.patch(
    API_ROUTES.WORKSPACE.UPDATE.replace(":workspaceId", data.workspaceId),
    {
      name: data.name,
      description: data.description,
    },
  );
  return response.data;
};

export const uploadWorkspaceLogo = async (workspaceId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await AxiosInstance.patch(
    API_ROUTES.WORKSPACE.UPLOAD_LOGO.replace(":workspaceId", workspaceId),
    formData,
  );

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

export const completeProfile = async (
  token: string,
  data: completeProfilePayload,
) => {
  const response = await AxiosInstance.post(
    API_ROUTES.INVITATION.COMPLETEPROFILE.replace(":token", token),
    data,
  );
  return response.data;
};

export const getWorkspaceMembers = async (workspaceId: string) => {
  const response = await AxiosInstance.get(
    API_ROUTES.WORKSPACE.GET_MEMBERS.replace(":workspaceId", workspaceId),
  );
  return response.data;
};

export const removeWorkspaceMember = async (
  data: removeWorkspaceMemberPayload,
) => {
  const response = await AxiosInstance.delete(
    API_ROUTES.WORKSPACE.DELETE_MEMBERS.replace(
      ":workspaceId",
      data.workspaceId,
    ).replace(":memberId", data.memberId),
  );
  return response.data;
};

export const createRole = async (data: createRolePayload) => {
  const response = await AxiosInstance.post(API_ROUTES.ROLE.CREATE_ROLE, data);
  return response.data;
};

export const getAllRoles = async () => {
  const response = await AxiosInstance.get(API_ROUTES.ROLE.GET_ROLES);
  return response.data;
};

export const updateRole = async (data: updateRolePayload) => {
  const response = await AxiosInstance.patch(
    API_ROUTES.ROLE.UPDATE_ROLE.replace(":roleId", data.roleId),
    data,
  );
  return response.data;
};

export const deleteRole = async (roleId: string) => {
  const response = await AxiosInstance.delete(
    API_ROUTES.ROLE.DELETE_ROLE.replace(":roleId", roleId),
  );
  return response.data;
};

export const getWorkspacePaymentDetails = async (workspaceId: string) => {
  const response = await AxiosInstance.get(
    API_ROUTES.WORKSPACE.GET_PAYMENT_DETAILS.replace(
      ":workspaceId",
      workspaceId,
    ),
  );

  return response.data;
};

export const upgradeSubscription = async (data: CreateSubscriptionPayload) => {
  const response = await AxiosInstance.post(
    API_ROUTES.SUBSCRIPTION.UPGRADE,
    data,
  );

  return response.data;
};

export const retryPayment = async (data:RetryPaymentPayload) => {
  const response = await AxiosInstance.post(API_ROUTES.PAYMENT.RETRY, data);
  return response.data;
};
