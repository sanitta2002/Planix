import { BaseRepository } from 'src/users/repository/BaseRepo/BaseRepo';
import {
  Notification,
  NotificationDocument,
} from '../Model/notification.schema';
import { INotificationRepository } from '../interface/INotificationRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

export class NotificationRepository
  extends BaseRepository<NotificationDocument>
  implements INotificationRepository
{
  constructor(
    @InjectModel(Notification.name)
    private readonly _notification: Model<NotificationDocument>,
  ) {
    super(_notification);
  }
  async markAsRead(
    notificationId: string,
  ): Promise<NotificationDocument | null> {
    return await this._notification.findByIdAndUpdate(
      notificationId,
      {
        isRead: true,
      },
      {
        new: true,
      },
    );
  }
  async markAllAsRead(receiverId: string): Promise<void> {
    await this._notification.updateMany(
      {
        receiver: new Types.ObjectId(receiverId),
        isRead: false,
      },
      {
        isRead: true,
      },
    );
  }

  async getNotificationsByReceiver(
    receiverId: string,
  ): Promise<NotificationDocument[]> {
    return await this._notification
      .find({ receiver: new Types.ObjectId(receiverId) })
      .sort({ createdAt: -1 })
      .populate('sender', 'firstName lastName avatar')
      .exec();
  }

  async getUnreadCount(receiverId: string): Promise<number> {
    return await this._notification
      .countDocuments({
        receiver: new Types.ObjectId(receiverId),
        isRead: false,
      })
      .exec();
  }
}
