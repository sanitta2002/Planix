import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  getWorkspacePaymentDetails,
  getWorkspaceProfile,
  inviteMembers,
  removeWorkspaceMember,
  retryPayment,
  updateProfile,
  updateRole,
  updateWorkspace,
  upgradeSubscription,
  uploadAvatar,
  uploadWorkspaceLogo,
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

export const useWorkspaceProfile = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace-profile", workspaceId],
    queryFn: () => getWorkspaceProfile(workspaceId),
    enabled: !!workspaceId,
  });
};

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWorkspace,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-profile", variables.workspaceId],
      });
    },
  });
};

export const useUploadWorkspaceLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, file }: { workspaceId: string; file: File }) =>
      uploadWorkspaceLogo(workspaceId, file),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-profile", variables.workspaceId],
      });
    },
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

export const useWorkspaceMembers = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: () => getWorkspaceMembers(workspaceId),
    enabled: !!workspaceId,
  });
};

export const useRemoveWorkspaceMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeWorkspaceMember,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-members", variables.workspaceId],
      });
    },
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
export const useGetRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getAllRoles,
  });
};

export const useUpdateRole = () => {
  return useMutation({
    mutationFn: updateRole,
  });
};

export const useDeleteRole = () => {
  return useMutation({
    mutationFn: deleteRole,
  });
};

export const useWorkspacePaymentDetails = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace-payment", workspaceId],
    queryFn: () => getWorkspacePaymentDetails(workspaceId),
    enabled: !!workspaceId,
  });
};

export const useUpgradeSubscription = () => {
  return useMutation({
    mutationFn: upgradeSubscription,
  });
};

export const useRetryPayment = () => {
  return useMutation({
    mutationFn: retryPayment,
  });
};

