import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import type { ICommentService } from '../Interface/ICommentService';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/getuser.decorator';
import type { AuthUser } from 'src/common/decorators/getuser.decorator';
import { CreateCommentDTO } from '../dto/req/CreateCommentDTO';
import { ApiResponse } from 'src/common/utils/api-response.util';
import { COMMENT_MESSAGES } from 'src/common/constants/messages.constant';
import { UpdateCommentDTO } from '../dto/req/UpdateCommentDTO';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentController {
  constructor(
    @Inject('ICommentService')
    private readonly _commentService: ICommentService,
  ) {}
  @Post(':issueId')
  async createComment(
    @Param('issueId') issueId: string,
    @Body() dto: CreateCommentDTO,
    @GetUser() user: AuthUser,
  ) {
    dto.issueId = issueId;
    const comment = await this._commentService.createComment(user.userId, dto);
    return ApiResponse.success(
      HttpStatus.CREATED,
      COMMENT_MESSAGES.CREATED,
      comment,
    );
  }

  @Get(':issueId')
  async getComments(@Param('issueId') issueId: string) {
    const comments = await this._commentService.getCommentsByIssueId(issueId);
    return ApiResponse.success(
      HttpStatus.OK,
      COMMENT_MESSAGES.FETCHED,
      comments,
    );
  }

  @Delete(':commentId')
  async deleteComment(
    @Param('commentId') commentId: string,
    @GetUser() user: AuthUser,
  ) {
    await this._commentService.deleteComment(user.userId, commentId);
    return ApiResponse.success(HttpStatus.OK, COMMENT_MESSAGES.DELETED);
  }

  @Patch(':commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentDTO,
    @GetUser() user: AuthUser,
  ) {
    const comment = await this._commentService.updateComment(
      user.userId,
      commentId,
      dto.content,
    );
    return ApiResponse.success(
      HttpStatus.OK,
      COMMENT_MESSAGES.UPDATED,
      comment,
    );
  }
}
