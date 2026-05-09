import { IBaseRepository } from 'src/users/interfaces/baseRepo.interface';
import { Comment, CommentDocument } from '../Model/comment.schema';

export interface ICommentRepository extends IBaseRepository<CommentDocument> {
  createCommentWithPopulate(data: Partial<Comment>): Promise<CommentDocument>;
  getCommentsByIssueId(issueId: string): Promise<CommentDocument[]>;
}
