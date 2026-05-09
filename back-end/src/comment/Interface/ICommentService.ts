import { CreateCommentDTO } from '../dto/req/CreateCommentDTO';
import { CommentResponseDTO } from '../dto/res/CommentResponseDTO';

export interface ICommentService {
  createComment(
    userId: string,
    dto: CreateCommentDTO,
  ): Promise<CommentResponseDTO>;

  getCommentsByIssueId(issueId: string): Promise<CommentResponseDTO[]>;
  deleteComment(userId: string, commentId: string): Promise<void>;
  updateComment(
    userId: string,
    commentId: string,
    content: string,
  ): Promise<CommentResponseDTO>;
}
