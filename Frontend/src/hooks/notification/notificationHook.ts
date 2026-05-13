import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getNotifications, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead 
} from "../../Service/notification/notificationService";
import { useDispatch } from "react-redux";
import { 
  setNotifications, 
  setUnreadCount, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from "../../store/notificationSlice";
import { useEffect } from "react";

export const useNotifications = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const { data: unreadCount } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: getUnreadCount,
  });

  useEffect(() => {
    if (notifications) {
      dispatch(setNotifications(notifications));
    }
  }, [notifications, dispatch]);

  useEffect(() => {
    if (unreadCount !== undefined) {
      dispatch(setUnreadCount(unreadCount));
    }
  }, [unreadCount, dispatch]);

  const markReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: (data) => {
      dispatch(markNotificationAsRead(data._id));
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      dispatch(markAllNotificationsAsRead());
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
    },
  });

  return {
    notifications,
    isLoading,
    error,
    unreadCount,
    markAsRead: markReadMutation.mutate,
    markAllAsRead: markAllReadMutation.mutate,
  };
};
