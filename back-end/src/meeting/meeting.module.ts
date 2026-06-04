import { Module } from '@nestjs/common';
import { MeetingService } from './service/meeting.service';
import { MeetingController } from './controller/meeting.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Meeting, MeetingSchema } from './Model/MeetingSchema';
import { MeetingRepository } from './repository/meeting.repository';
import { NotificationModule } from '@/notification/notification.module';
import { ProjectModule } from '@/project/project.module';
import { LoggerModule } from '@/logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Meeting.name,
        schema: MeetingSchema,
      },
    ]),
    NotificationModule,
    ProjectModule,
    LoggerModule,
  ],
  providers: [
    {
      provide: 'IMeetingService',
      useClass: MeetingService,
    },
    {
      provide: 'IMeetingRepository',
      useClass: MeetingRepository,
    },
  ],
  controllers: [MeetingController],
})
export class MeetingModule {}
