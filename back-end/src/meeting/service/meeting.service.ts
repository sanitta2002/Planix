import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IMeetingService } from '@/meeting/interface/IMeetingService';
import type { IMeetingRepository } from '@/meeting/interface/IMeetingRepository';
import { CreateMeetingDto } from '@/meeting/dto/req/CreateMeetingDto';
import { MeetingResponse } from '@/meeting/dto/res/ MeetingResponse';
import { MEETING_MESSAGES } from '@/common/constants/messages.constant';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { MeetingMapper } from './mapper/MeetingMapper';
import { UpdateMeetingDto } from '@/meeting/dto/req/UpdateMeetingDto';
import { MeetingStatus } from '@/common/type/MeetingStatus';
import type { INotificationService } from '@/notification/interface/INotificationService';
import type { IProjectMemberRepository } from '@/project/interfaces/IProjectMemberRepository';
import { NotificationType } from '@/common/type/NotificationType';
import { Types } from 'mongoose';
import type { ILogger } from '@/logger/ILogger';

@Injectable()
export class MeetingService implements IMeetingService {
  constructor(
    @Inject('ILogger')
    private readonly _logger: ILogger,
    @Inject('IMeetingRepository')
    private readonly _meetingRepo: IMeetingRepository,
    private readonly _configService: ConfigService,
    @Inject('INotificationService')
    private readonly _notificationService: INotificationService,
    @Inject('IProjectMemberRepository')
    private readonly _projectMemberRepository: IProjectMemberRepository,
  ) {}
  async createMeeting(
    dto: CreateMeetingDto,
    userId: string,
  ): Promise<MeetingResponse> {
    this._logger.info(
      `creating meeting: ${dto.title} for project ${dto.projectId}`,
    );

    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);
    if (start >= end) {
      throw new BadRequestException(MEETING_MESSAGES.INVALID_DATES);
    }
    const roomId = randomUUID();
    console.log('*********', roomId);
    this._logger.info(`Generated roomId: ${roomId}`);
    const meetingEntity = MeetingMapper.toEntity(dto, userId, roomId);
    const meeting = await this._meetingRepo.create(meetingEntity);

    this._logger.info(`meeting created success: ${meeting.id}`);

    try {
      const members = await this._projectMemberRepository.getProjectMembers(
        dto.projectId,
      );
      for (const member of members) {
        const memberUserId = member.userId._id.toString();
        if (memberUserId !== userId) {
          await this._notificationService.createNotification({
            sender: new Types.ObjectId(userId),
            receiver: new Types.ObjectId(memberUserId),
            notificationType: NotificationType.MEETING_SCHEDULED,
            message: `A new meeting '${dto.title}' has been scheduled.`,
          });
        }
      }
    } catch (error) {
      console.error('Failed to send meeting notifications', error);
    }

    return MeetingMapper.toResponse(meeting);
  }
  async getMeetingsByProject(projectId: string): Promise<MeetingResponse[]> {
    const meetings = await this._meetingRepo.findByProject(projectId);

    return meetings.map((meeting) => MeetingMapper.toResponse(meeting));
  }
  async getMeetingById(meetingId: string): Promise<MeetingResponse> {
    const meeting = await this._meetingRepo.findById(meetingId);

    if (!meeting) {
      throw new NotFoundException(MEETING_MESSAGES.NOT_FOUND);
    }

    return MeetingMapper.toResponse(meeting);
  }
  async updateMeeting(
    meetingId: string,
    dto: UpdateMeetingDto,
  ): Promise<MeetingResponse> {
    const meeting = await this._meetingRepo.findById(meetingId);

    if (!meeting) {
      throw new NotFoundException(MEETING_MESSAGES.NOT_FOUND);
    }

    const updateData: Record<string, unknown> = {};

    if (dto.title) {
      updateData.title = dto.title;
    }

    if (dto.description) {
      updateData.description = dto.description;
    }

    if (dto.startTime) {
      updateData.startTime = new Date(dto.startTime);
    }

    if (dto.endTime) {
      updateData.endTime = new Date(dto.endTime);
    }

    if (dto.status) {
      updateData.status = dto.status;
    }

    if (dto.meetingType) {
      updateData.meetingType = dto.meetingType;
    }

    if (dto.location) {
      updateData.location = dto.location;
    }

    if (dto.notes) {
      updateData.notes = dto.notes;
    }
    const updatedMeeting = await this._meetingRepo.updateById(
      meetingId,
      updateData,
    );

    if (!updatedMeeting) {
      throw new NotFoundException(MEETING_MESSAGES.NOT_FOUND);
    }

    return MeetingMapper.toResponse(updatedMeeting);
  }
  async joinMeeting(meetingId: string): Promise<MeetingResponse> {
    this._logger.info(`user joining meeting: ${meetingId}`);
    const meeting = await this._meetingRepo.findById(meetingId);

    if (!meeting) {
      throw new NotFoundException(MEETING_MESSAGES.NOT_FOUND);
    }

    const updatedMeeting = await this._meetingRepo.updateById(meetingId, {
      startedAt: meeting.startedAt ?? new Date(),
    });

    this._logger.info(`meeting joined success: ${meetingId}`);

    return MeetingMapper.toResponse(updatedMeeting!);
  }
  async endMeeting(meetingId: string): Promise<MeetingResponse> {
    const meeting = await this._meetingRepo.findById(meetingId);

    if (!meeting) {
      throw new NotFoundException(MEETING_MESSAGES.NOT_FOUND);
    }

    const updatedMeeting = await this._meetingRepo.updateById(meetingId, {
      status: MeetingStatus.COMPLETED,
      endedAt: new Date(),
    });

    if (!updatedMeeting) {
      throw new NotFoundException(MEETING_MESSAGES.NOT_FOUND);
    }

    return MeetingMapper.toResponse(updatedMeeting);
  }
}
