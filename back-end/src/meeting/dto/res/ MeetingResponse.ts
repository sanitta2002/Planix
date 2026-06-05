import { MeetingStatus } from '@/common/type/MeetingStatus';
import { MeetingType } from '@/common/type/MeetingType';

export interface MeetingResponse {
  id: string;
  title: string;
  description?: string;

  workspaceId: string;
  projectId: string;

  startTime: Date;
  endTime: Date;

  status: MeetingStatus;
  meetingType: MeetingType;

  location?: string;

  roomId: string;
  meetingLink?: string;

  host: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  createdBy: string;

  attendees: string[];

  notes?: string;

  startedAt?: Date;
  endedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}
