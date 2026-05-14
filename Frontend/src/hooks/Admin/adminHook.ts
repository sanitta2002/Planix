import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminLogin,
  blockUser,
  createPlan,
  deletePlan,
  getAllPayments,
  getPlans,
  getUsers,
  getWorkspaces,
  unblockUser,
  updatePlan,
  type GetUsersPayload,
  type GetWorkspacePayload,
  type UpdatePlanPayload,
} from "../../Service/admin/adminService";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: adminLogin,
  });
};

export const useGetUsers = (params: GetUsersPayload) => {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => getUsers(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      toast.success("User blocked successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => {
      toast.error("Failed to block user");
    },
  });
};

export const useUnblockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unblockUser,
    onSuccess: () => {
      toast.success("User unblocked successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => {
      toast.error("Failed to unblock user");
    },
  });
};

export const useDebounce = (value: string, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

export const useGetPlans = () => {
  return useQuery({
    queryKey: ["subscription-plans"],
    queryFn: getPlans,
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlan,
    onSuccess: () => {
      toast.success("Plan created successfully");
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
    },
    onError: () => {
      toast.error("Failed to create plan");
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      planId,
      data,
    }: {
      planId: string;
      data: UpdatePlanPayload;
    }) => updatePlan(planId, data),

    onSuccess: () => {
      toast.success("Plan updated successfully");
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
    },
    onError: () => {
      toast.error("Failed to update plan");
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      toast.success("Plan deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
    },
    onError: () => {
      toast.error("Failed to delete plan");
    },
  });
};

export const useGetWorkspaces = (params: GetWorkspacePayload) => {
  return useQuery({
    queryKey: ["admin-workspaces", params.page,
      params.limit,
      params.search,],
    queryFn: () => getWorkspaces(params),
   select: (res) => res.data,
  });
};


export const useGetAllpayments = (params?: {
  planId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["admin-payments", params],
    queryFn: () => getAllPayments(params),
    select: (res) => res.data,
  });
};
