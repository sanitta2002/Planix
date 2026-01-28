import { useMutation } from "@tanstack/react-query"
import { forgotPassword, googleLogin, LoginUser, registerUser, resendOtp, resetPassword, verifyOtp } from "../../Service/Auth/authService"


export const useUserSignUp =()=>{
    return useMutation({
        mutationFn:registerUser
    })
}

export const useVerifyOtp =()=>{
    return useMutation({
        mutationFn:verifyOtp
    })
}

export const useResendOtp =()=>{
    return useMutation({
        mutationFn:resendOtp,
        retry:false
    })
}

export const useLogin  = ()=>{
    return useMutation({
        mutationFn:LoginUser
    })
}

export const useForgotPassword =()=>{
    return useMutation({
        mutationFn:forgotPassword
    })
}

export const useResetPassword=()=>{
    return useMutation({
        mutationFn:resetPassword
    })
}

export const useBackendGoogleLogin =()=>{
    return useMutation({
        mutationFn:googleLogin
    })
}