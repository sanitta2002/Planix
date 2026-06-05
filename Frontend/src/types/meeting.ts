export enum MeetingStatus {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  COMPLETED = 'COMPLETED',
  MISSED = 'MISSED',
}

export enum MeetingType {
  ONLINE = 'ONLINE',
  PHYSICAL = 'PHYSICAL',
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  workspaceId: string;
  projectId: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
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
  startedAt?: string;
  endedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMeetingDto {
  title: string;
  description?: string;
  workspaceId: string;
  projectId: string;
  startTime: string;
  endTime: string;
  meetingType?: MeetingType;
  location?: string;
  attendeeIds?: string[];
}

export interface UpdateMeetingDto {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  status?: MeetingStatus;
  meetingType?: MeetingType;
  location?: string;
  notes?: string;
}
