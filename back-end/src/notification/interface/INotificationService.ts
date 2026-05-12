import { NotificationDocument } from '../Model/notification.schema';

export interface INotificationService {
  createNotification(
    notification: Partial<NotificationDocument>,
  ): Promise<NotificationDocument | null>;
  getNotifications(receiverId: string): Promise<NotificationDocument[]>;
  getUnreadCount(receiverId: string): Promise<number>;
  markAsRead(notificationId: string): Promise<NotificationDocument | null>;
  markAllAsRead(receiverId: string): Promise<void>;
}
