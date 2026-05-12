import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import type { INotificationService } from '../interface/INotificationService';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/getuser.decorator';
import type { AuthUser } from 'src/common/decorators/getuser.decorator';
import { ApiResponse } from 'src/common/utils/api-response.util';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { NotificationDocument } from '../Model/notification.schema';

import { NOTIFICATION_MESSAGES } from 'src/common/constants/messages.constant';

@UseGuards(JwtAuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(
    @Inject('INotificationService')
    private readonly _notificationService: INotificationService,
  ) {}

  @Get()
  async getNotifications(
    @GetUser() user: AuthUser,
  ): Promise<ApiResponseDto<NotificationDocument[]>> {
    const notifications = await this._notificationService.getNotifications(
      user.userId,
    );
    return ApiResponse.success(
      HttpStatus.OK,
      NOTIFICATION_MESSAGES.FETCHED,
      notifications,
    );
  }

  @Get('unread-count')
  async getUnreadCount(
    @GetUser() user: AuthUser,
  ): Promise<ApiResponseDto<number>> {
    const count = await this._notificationService.getUnreadCount(user.userId);
    return ApiResponse.success(
      HttpStatus.OK,
      NOTIFICATION_MESSAGES.COUNT_FETCHED,
      count,
    );
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<NotificationDocument | null>> {
    const notification = await this._notificationService.markAsRead(id);
    return ApiResponse.success(
      HttpStatus.OK,
      NOTIFICATION_MESSAGES.MARKED_AS_READ,
      notification,
    );
  }

  @Patch('read-all')
  async markAllAsRead(
    @GetUser() user: AuthUser,
  ): Promise<ApiResponseDto<void>> {
    await this._notificationService.markAllAsRead(user.userId);
    return ApiResponse.success(
      HttpStatus.OK,
      NOTIFICATION_MESSAGES.ALL_MARKED_AS_READ,
    );
  }
}
