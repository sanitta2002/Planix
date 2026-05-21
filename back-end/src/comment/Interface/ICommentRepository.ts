import { IBaseRepository } from '@/users/interfaces/baseRepo.interface';
import { Comment, CommentDocument } from '@/comment/Model/comment.schema';

export interface ICommentRepository extends IBaseRepository<CommentDocument> {
  createCommentWithPopulate(data: Partial<Comment>): Promise<CommentDocument>;
  getCommentsByIssueId(issueId: string): Promise<CommentDocument[]>;
}
