import { SendMessageDTO, AttachmentDTO } from '@/chat/dto/req/SendMessageDTO';
import { UpdateMessageDTO } from '@/chat/dto/req/UpdateMessageDTO';
import {
  MessageResponse,
  ChatHistoryResponse,
} from '@/chat/dto/res/MessageResponse';

export interface IChatService {
  uploadAttachments(
    files: Express.Multer.File[],
    userId: string,
  ): Promise<AttachmentDTO[]>;

  sendMessage(senderId: string, dto: SendMessageDTO): Promise<MessageResponse>;

  getChatHistory(
    projectId: string,
    limit: number,
    offset: number,
  ): Promise<ChatHistoryResponse>;

  updateMessage(
    senderId: string,
    messageId: string,
    dto: UpdateMessageDTO,
  ): Promise<MessageResponse>;

  deleteMessage(senderId: string, messageId: string): Promise<void>;
}
