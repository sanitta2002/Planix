import { AxiosInstance } from "../../axios/axios"
import { API_ROUTES } from "../../constants/apiRoutes"

interface adminLoginPayload {
  email: string
  password: string
}

export const adminLogin = async (data:adminLoginPayload)=>{
    const response = await AxiosInstance.post(API_ROUTES.Admin.LOGIN,data)
    return response.data
}