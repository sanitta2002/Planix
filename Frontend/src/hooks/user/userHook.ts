import { useMutation } from "@tanstack/react-query"
import { changePassword, updateProfile } from "../../Service/user/userService"


export const useUpdateProfile =()=>{
    return useMutation({
        mutationFn:updateProfile
    })
}

export const useChangePassword =()=>{
    return useMutation({
        mutationFn:changePassword
    })
}