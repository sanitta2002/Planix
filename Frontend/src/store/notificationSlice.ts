import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type NotificationResponse } from "../Service/notification/notificationService";

interface NotificationState {
  notifications: NotificationResponse[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<NotificationResponse[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.isRead).length;
    },
    addNotification: (state, action: PayloadAction<NotificationResponse>) => {
      state.notifications = [action.payload, ...state.notifications];
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n._id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.isRead = true;
      });
      state.unreadCount = 0;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  setUnreadCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;
