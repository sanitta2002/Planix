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
    const formData = new FormData()
    formData.append('file',file)
    formData.append("source","profile")
    const response = await AxiosInstance.patch(API_ROUTES.USER.UPLOAD_AVATAR,formData)
    return response.data
};

export const getProfile = async () => {
  const response = await AxiosInstance.get(
    API_ROUTES.USER.GET_PROFILE
  );
  return response.data;
};
