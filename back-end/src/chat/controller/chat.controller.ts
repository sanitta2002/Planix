import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { IChatService } from '@/chat/interface/IChatService';
import { GetUser } from '@/common/decorators/getuser.decorator';
import type { AuthUser } from '@/common/decorators/getuser.decorator';
import { SendMessageDTO } from '@/chat/dto/req/SendMessageDTO';
import { ApiResponse } from '@/common/utils/api-response.util';
import { ApiResponseDto } from '@/common/dto/api-response.dto';
import {
  ChatHistoryResponse,
  MessageResponse,
} from '../dto/res/MessageResponse';
import { GetChatHistoryDTO } from '@/chat/dto/req/GetChatHistoryDTO';
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
    return ApiResponse.success(
      HttpStatus.CREATED,
      'Message sent successfully',
      message,
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
    return ApiResponse.success(
      HttpStatus.OK,
      'Chat history fetched successfully',
      result,
    );
  }
}
