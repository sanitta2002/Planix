import { CreateMeetingDto } from '@/meeting/dto/req/CreateMeetingDto';
import { UpdateMeetingDto } from '@/meeting/dto/req/UpdateMeetingDto';
import { MeetingResponse } from '@/meeting/dto/res/ MeetingResponse';

export interface IMeetingService {
  createMeeting(
    dto: CreateMeetingDto,
    userId: string,
  ): Promise<MeetingResponse>;

  getMeetingsByProject(projectId: string): Promise<MeetingResponse[]>;

  getMeetingById(meetingId: string): Promise<MeetingResponse>;

  updateMeeting(
    meetingId: string,
    dto: UpdateMeetingDto,
  ): Promise<MeetingResponse>;

  joinMeeting(meetingId: string, userId: string): Promise<MeetingResponse>;

  endMeeting(meetingId: string): Promise<MeetingResponse>;
}
