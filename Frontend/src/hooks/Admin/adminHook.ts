import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminLogin,
  blockUser,
  getUsers,
  unblockUser,
  type GetUsersPayload,
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


export const useDebounce = (value, delay = 500)=>{
  const [debouncedValue , setDebouncedValue] = useState(value)

  useEffect(()=>{
    const timer=setTimeout(()=>{
      setDebouncedValue(value)
    },delay)
    return ()=>clearTimeout(timer)
  },[value,delay])
  return debouncedValue
}