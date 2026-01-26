import { useMutation } from "@tanstack/react-query"
import { LoginUser, registerUser, resendOtp, verifyOtp } from "../../Service/Auth/authService"


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