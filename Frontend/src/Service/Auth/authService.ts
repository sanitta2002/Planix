
import { AxiosInstance } from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";


interface RegisterPayload{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

interface verifyOtpPayload{
  email: string
  otp: string
}

interface ResendOtpPayload {
    email:string
}

interface loginPayload{
    email:string,
     password: string;
}

export const registerUser = async (data:RegisterPayload)=>{
    const response = await AxiosInstance.post(API_ROUTES.Auth.REGISTER,data)
    return response.data
}

export const verifyOtp = async (data:verifyOtpPayload)=>{
    const response = await AxiosInstance.post(API_ROUTES.Auth.VERIFY_EMAIL,data)
    return response.data
}

export const resendOtp = async (data:ResendOtpPayload)=>{
    const response = await AxiosInstance.post(API_ROUTES.Auth.RESEND_OTP,data)
    return response.data
}

export const LoginUser = async (data:loginPayload)=>{
    const response = await AxiosInstance.post(API_ROUTES.Auth.LOGIN,data)
    return response.data
}