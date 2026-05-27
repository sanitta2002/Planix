import { Module } from '@nestjs/common';
import { NotificationService } from '@/notification/service/notification.service';
import { NotificationController } from '@/notification/controller/notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from '@/notification/Model/notification.schema';
import { NotificationRepository } from '@/notification/repository/notification.repository';
import { NotificationGateway } from '@/notification/gateway/notification.gateway';
import { NotificationListener } from '@/notification/listener/notification.listener';
import { LoggerModule } from '@/logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    LoggerModule,
  ],
  providers: [
    NotificationGateway,
    NotificationListener,
    {
      provide: 'INotificationRepository',
      useClass: NotificationRepository,
    },
    {
      provide: 'INotificationService',
      useClass: NotificationService,
    },
  ],
  controllers: [NotificationController],
  exports: ['INotificationService'],
})
export class NotificationModule {}
