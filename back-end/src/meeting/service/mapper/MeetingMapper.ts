import { Types } from 'mongoose';
import { CreateMeetingDto } from '@/meeting/dto/req/CreateMeetingDto';
import { MeetingStatus } from '@/common/type/MeetingStatus';
import { MeetingType } from '@/common/type/MeetingType';
import { Meeting, MeetingDocument } from '@/meeting/Model/MeetingSchema';
import { UserDocument } from '@/users/Models/user.schema';

export class MeetingMapper {
  static toEntity(
    dto: CreateMeetingDto,
    userId: string,
    roomId: string,
  ): Partial<Meeting> {
    return {
      title: dto.title,
      description: dto.description,

      workspaceId: new Types.ObjectId(dto.workspaceId),

      projectId: new Types.ObjectId(dto.projectId),

      startTime: new Date(dto.startTime),
      endTime: new Date(dto.endTime),

      meetingType: dto.meetingType ?? MeetingType.ONLINE,

      location: dto.location,

      roomId,

      hostId: new Types.ObjectId(userId),
      createdBy: new Types.ObjectId(userId),

      attendees: dto.attendeeIds?.map((id) => new Types.ObjectId(id)) ?? [],

      status: MeetingStatus.SCHEDULED,
    };
  }

  static toResponse(meeting: MeetingDocument) {
    let hostObj = {
      id: meeting.hostId?.toString() || '',
      name: 'Unknown Host',
      avatarUrl: '',
    };

    if (meeting.hostId) {
      const hostDoc = meeting.hostId as unknown as UserDocument;
      if (hostDoc.firstName !== undefined) {
        hostObj = {
          id: hostDoc._id.toString(),
          name: `${hostDoc.firstName || ''} ${hostDoc.lastName || ''}`.trim(),
          avatarUrl: hostDoc.avatarKey || '',
        };
      }
    }

    return {
      id: meeting._id.toString(),

      title: meeting.title,
      description: meeting.description,

      workspaceId: meeting.workspaceId.toString(),

      projectId: meeting.projectId.toString(),

      startTime: meeting.startTime,
      endTime: meeting.endTime,

      status: meeting.status,
      meetingType: meeting.meetingType,

      location: meeting.location,

      roomId: meeting.roomId,

      host: hostObj,

      createdBy: meeting.createdBy.toString(),

      attendees: meeting.attendees.map((id) => id.toString()),

      notes: meeting.notes,

      startedAt: meeting.startedAt,
      endedAt: meeting.endedAt,

      createdAt: meeting.createdAt,
      updatedAt: meeting.updatedAt,
    };
  }
}

