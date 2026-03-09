import { useMutation, useQuery } from "@tanstack/react-query";
import {
  acceptInvite,
  changePassword,
  completeProfile,
  confirmPayment,
  createRole,
  createSubscription,
  createWorkspace,
  deleteRole,
  getActivePlans,
  getAllRoles,
  getProfile,
  getUserWorkspaces,
  getWorkspaceMembers,
  inviteMembers,
  updateProfile,
  updateRole,
  uploadAvatar,
} from "../../Service/user/userService";

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateProfile,
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};

export const useUploadAvatar = () => {
  return useMutation({
    mutationFn: uploadAvatar,
  });
};

export const useGetProfile = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: getProfile,
  });
};

export const useCreateWorkspace = () => {
  return useMutation({
    mutationFn: createWorkspace,
  });
};

export const useUserWorkspaces = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: getUserWorkspaces,
  });
};

export const useGetActivePlan = () => {
  return useQuery({
    queryKey: ["active-plans"],
    queryFn: getActivePlans,
  });
};

export const useCreateSubscription = () => {
  return useMutation({
    mutationFn: createSubscription,
  });
};

export const useConfirmPayment = () => {
  return useMutation({
    mutationFn: confirmPayment,
  });
};

export const useInviteMember = () => {
  return useMutation({
    mutationFn: inviteMembers,
  });
};

export const useAcceptInvite = (token: string) => {
  return useQuery({
    queryKey: ["accept-invite", token],
    queryFn: () => acceptInvite(token),
    enabled: !!token,
  });
};

export const useCompleteProfile = () => {
  return useMutation({
    mutationFn: ({
      token,
      data,
    }: {
      token: string;
      data: {
        firstName: string;
        lastName: string;
        password: string;
      };
    }) => completeProfile(token, data),
  });
};


export const useWorkspaceMembers = (workspaceId:string)=>{
  return useQuery({
    queryKey: ["workspacemembers", workspaceId],
    queryFn: () => getWorkspaceMembers(workspaceId),
    enabled: !!workspaceId,
  });
}

export const useCreateRole =()=>{
  return useMutation({
    mutationFn:createRole
  })
}
export const useGetRoles=()=>{
  return useQuery({
    queryKey:['roles'],
    queryFn:getAllRoles
  })
}

export const useUpdateRole = () => {
    return useMutation({
        mutationFn: updateRole
    })
}

export const useDeleteRole = () => {
    return useMutation({
        mutationFn: deleteRole
    })
}