import { CommentResponseDTO } from 'src/comment/dto/res/CommentResponseDTO';
import { CommentDocument } from 'src/comment/Model/comment.schema';
import { UserDocument } from 'src/users/Models/user.schema';

export class CommentMapper {
  static toResponse(comment: CommentDocument): CommentResponseDTO {
    const createdBy = comment.createdBy as unknown as UserDocument;

    return {
      id: comment._id.toString(),

      content: comment.content,

      issueId: comment.issueId.toString(),

      createdBy: {
        id: createdBy._id.toString(),
        name: `${createdBy.firstName} ${createdBy.lastName}`,
        email: createdBy.email,
      },
      mentions: comment.mentions.map((mention) => mention.toString()),
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  static toResponseList(comments: CommentDocument[]): CommentResponseDTO[] {
    return comments.map((comment) => this.toResponse(comment));
  }
}
