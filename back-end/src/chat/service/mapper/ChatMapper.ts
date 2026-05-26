import { MessageDocument } from '@/chat/Model/message.schema';
import { User } from '@/users/Models/user.schema';
import {
  MessageResponse,
  AttachmentResponse,
} from '@/chat/dto/res/MessageResponse';

export class ChatMapper {
  static toResponse(
    message: MessageDocument,
    sender: User | null,
    senderAvatarUrl?: string,
    attachments: AttachmentResponse[] = [],
  ): MessageResponse {
    return {
      id: message._id.toString(),
      projectId: message.projectId.toString(),
      senderId: message.senderId.toString(),
      senderName: sender
        ? `${sender.firstName} ${sender.lastName}`
        : 'Unknown User',
      senderAvatar: senderAvatarUrl,
      content: message.content,
      attachments,
      isEdited: message.isEdited ?? false,
      createdAt: message.createdAt ?? new Date(),
      updatedAt: message.updatedAt,
    };
  }
}
