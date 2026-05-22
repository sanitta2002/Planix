import { SendMessageDTO } from '@/chat/dto/req/SendMessageDTO';
import {
  MessageResponse,
  ChatHistoryResponse,
} from '@/chat/dto/res/MessageResponse';

export interface IChatService {
  sendMessage(senderId: string, dto: SendMessageDTO): Promise<MessageResponse>;

  getChatHistory(
    projectId: string,
    limit: number,
    offset: number,
  ): Promise<ChatHistoryResponse>;
}
