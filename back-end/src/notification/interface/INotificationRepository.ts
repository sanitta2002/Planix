import { IBaseRepository } from 'src/users/interfaces/baseRepo.interface';
import { NotificationDocument } from '../Model/notification.schema';

export interface INotificationRepository extends IBaseRepository<NotificationDocument> {
  markAsRead(notificationId: string): Promise<NotificationDocument | null>;
  markAllAsRead(receiverId: string): Promise<void>;
  getNotificationsByReceiver(
    receiverId: string,
  ): Promise<NotificationDocument[]>;
  getUnreadCount(receiverId: string): Promise<number>;
}
