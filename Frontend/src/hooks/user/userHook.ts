import { useMutation, useQuery } from "@tanstack/react-query"
import { changePassword, getProfile, updateProfile, uploadAvatar } from "../../Service/user/userService"


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

export const useUploadAvatar =()=>{
    return useMutation({
        mutationFn:uploadAvatar
    })
}

export const useGetProfile = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: getProfile,
  });
};
