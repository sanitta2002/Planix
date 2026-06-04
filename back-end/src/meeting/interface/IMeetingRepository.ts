import { IBaseRepository } from '@/users/interfaces/baseRepo.interface';
import { MeetingDocument } from '@/meeting/Model/MeetingSchema';

export interface IMeetingRepository extends IBaseRepository<MeetingDocument> {
  findByProject(projectId: string): Promise<MeetingDocument[]>;

  findUpcomingMeetings(projectId: string): Promise<MeetingDocument[]>;

  findRecentMeetings(projectId: string): Promise<MeetingDocument[]>;
}
