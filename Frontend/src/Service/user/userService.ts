import { AxiosInstance } from "../../axios/axios"
import { API_ROUTES } from "../../constants/apiRoutes"

interface updateProfilePayload {
    firstName: string,
    lastName: string,
    phoneNumber: string
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const updateProfile = async (data:updateProfilePayload)=>{
   const response = await AxiosInstance.patch(API_ROUTES.USER.UPDATE_PROFILE,data)
   return response.data
}

export const changePassword = async(data:ChangePasswordPayload)=>{
    const response = await AxiosInstance.patch(API_ROUTES.USER.CHANGE_PASSWORD,data)
    return response.data
}

