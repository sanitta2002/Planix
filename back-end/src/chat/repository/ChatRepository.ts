import { BaseRepository } from '@/users/repository/BaseRepo/BaseRepo';
import { Message, MessageDocument } from '@/chat/Model/message.schema';
import { IChatRepository } from '@/chat/interface/IChatRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

export class ChatRepository
  extends BaseRepository<MessageDocument>
  implements IChatRepository
{
  constructor(
    @InjectModel(Message.name) private _messageModal: Model<MessageDocument>,
  ) {
    super(_messageModal);
  }
  async findByProject(
    projectId: string,
    limit: number,
    offset: number,
  ): Promise<MessageDocument[]> {
    return await this._messageModal
      .find({
        projectId: new Types.ObjectId(projectId),
      })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();
  }
  async countByProject(projectId: string): Promise<number> {
    return await this._messageModal.countDocuments({ projectId });
  }
}
