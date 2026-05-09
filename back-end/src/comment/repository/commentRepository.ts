import { BaseRepository } from 'src/users/repository/BaseRepo/BaseRepo';
import { Comment, CommentDocument } from '../Model/comment.schema';
import { ICommentRepository } from '../Interface/ICommentRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

export class CommentRepository
  extends BaseRepository<CommentDocument>
  implements ICommentRepository
{
  constructor(
    @InjectModel(Comment.name)
    private readonly _comment: Model<CommentDocument>,
  ) {
    super(_comment);
  }

  async createCommentWithPopulate(
    data: Partial<Comment>,
  ): Promise<CommentDocument> {
    const createdComment = await this._comment.create(data);
    return await createdComment.populate(
      'createdBy',
      'firstName lastName email avatarKey',
    );
  }

  async getCommentsByIssueId(issueId: string): Promise<CommentDocument[]> {
    return await this._comment
      .find({ issueId: new Types.ObjectId(issueId), isDeleted: false })
      .populate('createdBy', 'firstName lastName email avatarKey')
      .sort({ createdAt: 1 });
  }
}
