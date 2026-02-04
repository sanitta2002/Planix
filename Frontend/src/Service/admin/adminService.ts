import { AxiosInstance } from "../../axios/axios"
import { API_ROUTES } from "../../constants/apiRoutes"

interface adminLoginPayload {
  email: string
  password: string
}

export interface GetUsersPayload {
  page?: number
  limit?: number
  search?: string
  isBlocked?: boolean
}

interface blockUserPayload {
  userId: string
}


export const adminLogin = async (data:adminLoginPayload)=>{
    const response = await AxiosInstance.post(API_ROUTES.Admin.LOGIN,data)
    return response.data
}

export const getUsers = async (params:GetUsersPayload)=>{
  const response = await AxiosInstance.get(API_ROUTES.Admin.GETUSERS,{params})
  return response.data
}

export const blockUser = async ({ userId }: blockUserPayload) => {
  const response = await AxiosInstance.patch(`${API_ROUTES.Admin.BASE}/${userId}/block`, { userId })
  return response.data
} 

export const unblockUser = async ({ userId }: blockUserPayload) => {
  const response = await AxiosInstance.patch(`${API_ROUTES.Admin.BASE}/${userId}/unblock`, { userId })
  return response.data
} 