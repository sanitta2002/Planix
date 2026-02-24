import { useMutation, useQuery } from "@tanstack/react-query"
import { changePassword, confirmPayment, createSubscription, createWorkspace, getActivePlans, getProfile, getUserWorkspaces, updateProfile, uploadAvatar } from "../../Service/user/userService"


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

export const useCreateWorkspace =()=>{
    return useMutation({
        mutationFn:createWorkspace
    })
}

export const useUserWorkspaces =()=>{
    return useQuery({
    queryKey: ["workspaces"],
    queryFn: getUserWorkspaces,
  });
}

export const useGetActivePlan = ()=>{
    return useQuery({
    queryKey: ["active-plans"],
    queryFn: getActivePlans,
  });
}

export const useCreateSubscription = ()=>{
    return useMutation({
        mutationFn:createSubscription
    })
}

export const useConfirmPayment = () => {
  return useMutation({
    mutationFn: confirmPayment,
  });
};