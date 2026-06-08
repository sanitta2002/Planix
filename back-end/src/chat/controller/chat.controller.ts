import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AttachmentDTO } from '@/chat/dto/req/SendMessageDTO';
import type { IChatService } from '@/chat/interface/IChatService';
import { GetUser } from '@/common/decorators/getuser.decorator';
import type { AuthUser } from '@/common/decorators/getuser.decorator';
import { SendMessageDTO } from '@/chat/dto/req/SendMessageDTO';
import { UpdateMessageDTO } from '@/chat/dto/req/UpdateMessageDTO';
import { ApiResponse } from '@/common/utils/api-response.util';
import { ApiResponseDto } from '@/common/dto/api-response.dto';
import {
  ChatHistoryResponse,
  MessageResponse,
} from '../dto/res/MessageResponse';
import { GetChatHistoryDTO } from '@/chat/dto/req/GetChatHistoryDTO';
import { CHAT_MESSAGES } from '@/common/constants/messages.constant';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(
    @Inject('IChatService')
    private readonly _chatService: IChatService,
  ) {}

  @Post('message')
  async sendMessage(
    @Body() dto: SendMessageDTO,
    @GetUser() user: AuthUser,
  ): Promise<ApiResponseDto<MessageResponse>> {
    const message = await this._chatService.sendMessage(user.userId, dto);
    return ApiResponse.success(HttpStatus.CREATED, CHAT_MESSAGES.SENT, message);
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadAttachments(
    @UploadedFiles() files: Express.Multer.File[],
    @GetUser() user: AuthUser,
  ): Promise<ApiResponseDto<AttachmentDTO[]>> {
    const attachments = await this._chatService.uploadAttachments(
      files,
      user.userId,
    );
    return ApiResponse.success(
      HttpStatus.CREATED,
      'Attachments uploaded successfully',
      attachments,
    );
  }

  @Get('history')
  async getHistory(
    @Query() dto: GetChatHistoryDTO,
  ): Promise<ApiResponseDto<ChatHistoryResponse>> {
    const result = await this._chatService.getChatHistory(
      dto.projectId,
      dto.limit ?? 50,
      dto.offset ?? 0,
    );
    return ApiResponse.success(HttpStatus.OK, CHAT_MESSAGES.FETCHED, result);
  }

  @Patch('message/:id')
  async updateMessage(
    @Param('id') messageId: string,
    @Body() dto: UpdateMessageDTO,
    @GetUser() user: AuthUser,
  ): Promise<ApiResponseDto<MessageResponse>> {
    const updated = await this._chatService.updateMessage(
      user.userId,
      messageId,
      dto,
    );
    return ApiResponse.success(HttpStatus.OK, CHAT_MESSAGES.UPDATED, updated);
  }

  @Delete('message/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMessage(
    @Param('id') messageId: string,
    @GetUser() user: AuthUser,
  ): Promise<void> {
    await this._chatService.deleteMessage(user.userId, messageId);
  }
}
