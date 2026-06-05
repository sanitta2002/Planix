import { BaseRepository } from '@/users/repository/BaseRepo/BaseRepo';
import { Injectable } from '@nestjs/common';
import { Meeting, MeetingDocument } from '@/meeting/Model/MeetingSchema';
import { IMeetingRepository } from '@/meeting/interface/IMeetingRepository';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MeetingStatus } from '@/common/type/MeetingStatus';

@Injectable()
export class MeetingRepository
  extends BaseRepository<MeetingDocument>
  implements IMeetingRepository
{
  constructor(
    @InjectModel(Meeting.name)
    private readonly _meeting: Model<MeetingDocument>,
  ) {
    super(_meeting);
  }
  async findByProject(projectId: string): Promise<MeetingDocument[]> {
    return await this._meeting
      .find({
        projectId: new Types.ObjectId(projectId),
      })
      .populate('hostId', 'firstName lastName avatarKey');
  }
  async findUpcomingMeetings(projectId: string): Promise<MeetingDocument[]> {
    return await this._meeting
      .find({
        projectId: new Types.ObjectId(projectId),
        status: MeetingStatus.SCHEDULED,
      })
      .populate('hostId', 'firstName lastName avatarKey')
      .sort({ startTime: 1 });
  }
  async findRecentMeetings(projectId: string): Promise<MeetingDocument[]> {
    return await this._meeting
      .find({
        projectId: new Types.ObjectId(projectId),
        status: MeetingStatus.COMPLETED,
      })
      .populate('hostId', 'firstName lastName avatarKey')
      .sort({ endTime: -1 });
  }
}
