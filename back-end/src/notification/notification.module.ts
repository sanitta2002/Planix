import { Module } from '@nestjs/common';
import { NotificationService } from './service/notification.service';
import { NotificationController } from './controller/notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './Model/notification.schema';
import { NotificationRepository } from './repository/notification.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  providers: [
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
