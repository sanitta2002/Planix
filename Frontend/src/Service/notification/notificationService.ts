import { AxiosInstance } from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";

export enum NotificationType {
  ISSUE_ASSIGNED = 'ISSUE_ASSIGNED',
  ISSUE_COMMENTED = 'ISSUE_COMMENTED',
  ISSUE_MENTIONED = 'ISSUE_MENTIONED',
  ISSUE_STATUS_CHANGED = 'ISSUE_STATUS_CHANGED',
  ISSUE_DUE_DATE_REMINDER = 'ISSUE_DUE_DATE_REMINDER',
  PROJECT_MEMBER_ADDED = 'PROJECT_MEMBER_ADDED',
  PROJECT_ROLE_CHANGED = 'PROJECT_ROLE_CHANGED',
  SPRINT_STARTED = 'SPRINT_STARTED',
  SPRINT_COMPLETED = 'SPRINT_COMPLETED',
  WORKSPACE_INVITE = 'WORKSPACE_INVITE',
  MEETING_SCHEDULED = 'MEETING_SCHEDULED',
  MEETING_RESCHEDULED = 'MEETING_RESCHEDULED',
  MEETING_REMINDER = 'MEETING_REMINDER',
  NEW_MESSAGE = 'NEW_MESSAGE',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  LOGIN_FROM_NEW_DEVICE = 'LOGIN_FROM_NEW_DEVICE',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
}

export interface NotificationResponse {
  _id: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    avatarKey?: string;
  };
  receiver: string;
  notificationType: NotificationType;
  message: string;
  referenceId: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getNotifications = async (): Promise<NotificationResponse[]> => {
  const response = await AxiosInstance.get(API_ROUTES.NOTIFICATION.GET_ALL);
  return response.data?.data || response.data;
};

export const getUnreadCount = async (): Promise<number> => {
  const response = await AxiosInstance.get(API_ROUTES.NOTIFICATION.GET_UNREAD_COUNT);
  return response.data?.data || response.data;
};

export const markAsRead = async (id: string): Promise<NotificationResponse> => {
  const response = await AxiosInstance.patch(
    API_ROUTES.NOTIFICATION.MARK_AS_READ.replace(":id", id)
  );
  return response.data?.data || response.data;
};

export const markAllAsRead = async (): Promise<void> => {
  await AxiosInstance.patch(API_ROUTES.NOTIFICATION.MARK_ALL_AS_READ);
};
