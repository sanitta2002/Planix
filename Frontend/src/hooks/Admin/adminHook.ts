import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminLogin,
  blockUser,
  createPlan,
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
import { AxiosError } from "axios";

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

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isBlocked: boolean;
  isEmailVerified?: boolean;
  avatarUrl?: string;
}

export interface GetUsersResponse {
  users: AdminUser[];
  total: number;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  features: string[];
  isActive?: boolean;
  description?: string;
  isRecommended?: boolean;
}

export interface GetPlansResponse {
  data: Plan[];
}

export const useBlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: blockUser,
    onSuccess: (_, variables) => {
      toast.success("User blocked successfully");
      queryClient.setQueriesData<GetUsersResponse>(
        { queryKey: ["admin-users"] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            users: oldData.users.map((user: AdminUser) =>
              user.id === variables.userId ? { ...user, isBlocked: true } : user
            ),
          };
        }
      );
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
    onSuccess: (_, variables) => {
      toast.success("User unblocked successfully");
      queryClient.setQueriesData<GetUsersResponse>(
        { queryKey: ["admin-users"] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            users: oldData.users.map((user: AdminUser) =>
              user.id === variables.userId ? { ...user, isBlocked: false } : user
            ),
          };
        }
      );
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
    onSuccess: (res: { data: Plan }) => {
      toast.success("Plan created successfully");
      queryClient.setQueryData<GetPlansResponse>(
        ["subscription-plans"],
        (oldData) => {
          if (!oldData) return { data: [res.data] };
          return {
            ...oldData,
            data: [...oldData.data, res.data],
          };
        }
      );
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

    onSuccess: (res: { data: Plan }, variables) => {
      if (variables.data.isActive !== undefined) {
        toast.success(
          variables.data.isActive
            ? "Plan listed successfully"
            : "Plan unlisted successfully"
        );
      } else {
        toast.success("Plan updated successfully");
      }
      queryClient.setQueryData<GetPlansResponse>(
        ["subscription-plans"],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((plan: Plan) =>
              plan.id === res.data.id ? res.data : plan
            ),
          };
        }
      );
    },
    onError: (error, variables) => {
      const err = error as AxiosError<{ message: string }>;
      if (err?.isAxiosError || err?.response) {
        const backendMessage = err.response?.data?.message || err.message;
        toast.error(backendMessage);
        return;
      }
      
      if (variables?.data?.isActive !== undefined) {
        toast.error(
          variables.data.isActive
            ? "Failed to list plan"
            : "Failed to unlist plan"
        );
      } else {
        toast.error("Failed to update plan");
      }
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
