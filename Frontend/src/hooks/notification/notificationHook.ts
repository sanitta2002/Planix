import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getNotifications, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead,
  type NotificationResponse
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
    onSuccess: (data: NotificationResponse) => {
      dispatch(markNotificationAsRead(data._id));
      
      
      queryClient.setQueryData<NotificationResponse[]>(
        ["notifications"],
        (oldNotifications) => {
          if (!oldNotifications) return oldNotifications;
          return oldNotifications.map((notif) =>
            notif._id === data._id ? { ...notif, isRead: true } : notif
          );
        }
      );

      
      queryClient.setQueryData<number>(
        ["unreadCount"],
        (oldCount) => {
          if (oldCount === undefined) return 0;
          return Math.max(0, oldCount - 1);
        }
      );
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      dispatch(markAllNotificationsAsRead());
      queryClient.setQueryData<NotificationResponse[]>(
        ["notifications"],
        (oldNotifications) => {
          if (!oldNotifications) return oldNotifications;
          return oldNotifications.map((notif) => ({ ...notif, isRead: true }));
        }
      );

      queryClient.setQueryData<number>(
        ["unreadCount"],
        () => 0
      );
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
