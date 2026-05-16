import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { INotificationService } from '../interface/INotificationService';
import type { INotificationRepository } from '../interface/INotificationRepository';
import { NotificationDocument } from '../Model/notification.schema';
import { Types } from 'mongoose';

import { NOTIFICATION_MESSAGES } from 'src/common/constants/messages.constant';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class NotificationService implements INotificationService {
  constructor(
    private readonly _logger: PinoLogger,
    @Inject('INotificationRepository')
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async createNotification(
    notification: Partial<NotificationDocument>,
  ): Promise<NotificationDocument | null> {
    this._logger.info(
      `create notification for receiver ${notification.receiver?.toString()}`,
    );
    if (notification.sender?.toString() === notification.receiver?.toString()) {
      return null;
    }

    return await this._notificationRepository.create(notification);
  }

  async getNotifications(receiverId: string): Promise<NotificationDocument[]> {
    this._logger.info(`fetch notification ${receiverId}`);
    if (!Types.ObjectId.isValid(receiverId)) {
      throw new BadRequestException(NOTIFICATION_MESSAGES.INVALID_RECEIVER_ID);
    }
    return await this._notificationRepository.getNotificationsByReceiver(
      receiverId,
    );
  }

  async getUnreadCount(receiverId: string): Promise<number> {
    if (!Types.ObjectId.isValid(receiverId)) {
      throw new BadRequestException(NOTIFICATION_MESSAGES.INVALID_RECEIVER_ID);
    }
    return await this._notificationRepository.getUnreadCount(receiverId);
  }

  async markAsRead(
    notificationId: string,
  ): Promise<NotificationDocument | null> {
    if (!Types.ObjectId.isValid(notificationId)) {
      throw new BadRequestException(
        NOTIFICATION_MESSAGES.INVALID_NOTIFICATION_ID,
      );
    }

    const notification =
      await this._notificationRepository.markAsRead(notificationId);

    if (!notification) {
      throw new NotFoundException(NOTIFICATION_MESSAGES.NOT_FOUND);
    }

    return notification;
  }

  async markAllAsRead(receiverId: string): Promise<void> {
    if (!Types.ObjectId.isValid(receiverId)) {
      throw new BadRequestException(NOTIFICATION_MESSAGES.INVALID_RECEIVER_ID);
    }
    await this._notificationRepository.markAllAsRead(receiverId);
  }
}
