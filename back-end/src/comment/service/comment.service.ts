import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICommentService } from '../Interface/ICommentService';
import type { ICommentRepository } from '../Interface/ICommentRepository';
import { CreateCommentDTO } from '../dto/req/CreateCommentDTO';
import { CommentResponseDTO } from '../dto/res/CommentResponseDTO';
import { COMMENT_MESSAGES } from 'src/common/constants/messages.constant';
import type { IIssueRepository } from 'src/issue/interface/IIssueRepository';
import { Types } from 'mongoose';
import { CommentMapper } from './Mapper/comment.mapper';

@Injectable()
export class CommentService implements ICommentService {
  constructor(
    @Inject('ICommentRepository')
    private readonly _commentRepo: ICommentRepository,
    @Inject('IIssueRepository') private readonly _issueRepo: IIssueRepository,
  ) {}
  async createComment(
    userId: string,
    dto: CreateCommentDTO,
  ): Promise<CommentResponseDTO> {
    const { issueId, content } = dto;
    if (!content.trim()) {
      throw new NotFoundException(COMMENT_MESSAGES.CONTENT_REQUIRED);
    }
    const issue = await this._issueRepo.findById(issueId);
    if (!issue) {
      throw new NotFoundException(COMMENT_MESSAGES.ISSUE_NOT_FOUND);
    }
    const newComment = {
      issueId: new Types.ObjectId(issueId),
      content: content,
      createdBy: new Types.ObjectId(userId),
      mentions: [],
    };
    const createComment =
      await this._commentRepo.createCommentWithPopulate(newComment);
    return CommentMapper.toResponse(createComment);
  }

  async getCommentsByIssueId(issueId: string): Promise<CommentResponseDTO[]> {
    const issue = await this._issueRepo.findById(issueId);
    if (!issue) {
      throw new NotFoundException(COMMENT_MESSAGES.ISSUE_NOT_FOUND);
    }
    const comments = await this._commentRepo.getCommentsByIssueId(issueId);
    return CommentMapper.toResponseList(comments);
  }

  async deleteComment(userId: string, commentId: string): Promise<void> {
    const comment = await this._commentRepo.findById(commentId);
    if (!comment) {
      throw new NotFoundException(COMMENT_MESSAGES.NOT_FOUND);
    }
    if (comment.createdBy.toString() === userId) {
      await this._commentRepo.deleteById(commentId);
      return;
    }
    throw new ForbiddenException(COMMENT_MESSAGES.FORBIDDEN_DELETE);
  }

  async updateComment(
    userId: string,
    commentId: string,
    content: string,
  ): Promise<CommentResponseDTO> {
    const comment = await this._commentRepo.findById(commentId);
    if (!comment) {
      throw new NotFoundException(COMMENT_MESSAGES.NOT_FOUND);
    }

    if (comment.createdBy.toString() !== userId) {
      throw new ForbiddenException(COMMENT_MESSAGES.FORBIDDEN_UPDATE);
    }

    const updatedComment = await this._commentRepo.updateById(commentId, {
      content,
    });
    if (!updatedComment) {
      throw new NotFoundException(COMMENT_MESSAGES.NOT_FOUND);
    }
    return CommentMapper.toResponse(updatedComment);
  }
}
