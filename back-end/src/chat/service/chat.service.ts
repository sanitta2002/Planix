import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IChatService } from '@/chat/interface/IChatService';
import type { IChatRepository } from '@/chat/interface/IChatRepository';
import { SendMessageDTO, AttachmentDTO } from '@/chat/dto/req/SendMessageDTO';
import { UpdateMessageDTO } from '@/chat/dto/req/UpdateMessageDTO';
import {
  ChatHistoryResponse,
  MessageResponse,
} from '@/chat/dto/res/MessageResponse';
import type { IUserRepository } from '@/users/interfaces/user.repository.interface';
import type { IprojectRepository } from '@/project/interfaces/IProjectRepository';
import type { IProjectMemberRepository } from '@/project/interfaces/IProjectMemberRepository';
import {
  PROJECT_ERRORS,
  USER_MESSAGES,
  CHAT_MESSAGES,
} from '@/common/constants/messages.constant';
import { Types } from 'mongoose';
import { ChatMapper } from './mapper/ChatMapper';
import { MessageDocument } from '@/chat/Model/message.schema';
import type { IS3Service } from '@/common/s3/interfaces/s3.service.interface';

@Injectable()
export class ChatService implements IChatService {
  constructor(
    @Inject('IChatRepository')
    private readonly _chatRepository: IChatRepository,
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
    @Inject('IprojectRepository')
    private readonly _projectRepository: IprojectRepository,
    @Inject('IProjectMemberRepository')
    private readonly _projectMemberRepository: IProjectMemberRepository,
    @Inject('IS3Service')
    private readonly _s3Service: IS3Service,
  ) {}

  async sendMessage(
    senderId: string,
    dto: SendMessageDTO,
  ): Promise<MessageResponse> {
    const project = await this._projectRepository.findById(dto.projectId);
    if (!project) {
      throw new NotFoundException(PROJECT_ERRORS.NO_PROJECTS_FOUND);
    }
    const sender = await this._userRepository.findById(senderId);
    if (!sender) {
      throw new NotFoundException(USER_MESSAGES.NOT_FOUND);
    }
    const projectMember =
      await this._projectMemberRepository.findProjectAndUser(
        dto.projectId,
        senderId,
      );
    if (!projectMember) {
      throw new ForbiddenException(PROJECT_ERRORS.MEMBER_NOT_FOUND);
    }
    const message = await this._chatRepository.create({
      projectId: new Types.ObjectId(dto.projectId),
      senderId: new Types.ObjectId(senderId),
      content: dto.content,
      attachments: dto.attachments || [],
    });
    const avatarUrl = sender.avatarKey
      ? await this._s3Service.createSignedUrl(sender.avatarKey)
      : undefined;
    const resolvedAttachments = await Promise.all(
      (message.attachments || []).map(async (att) => ({
        ...att,
        fileUrl: await this._s3Service.createSignedUrl(att.fileKey),
      })),
    );
    return ChatMapper.toResponse(
      message,
      sender,
      avatarUrl,
      resolvedAttachments,
    );
  }

  async getChatHistory(
    projectId: string,
    limit: number,
    offset: number,
  ): Promise<ChatHistoryResponse> {
    const project = await this._projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundException(PROJECT_ERRORS.NO_PROJECTS_FOUND);
    }
    const messages = await this._chatRepository.findByProject(
      projectId,
      limit,
      offset,
    );
    const total = await this._chatRepository.countByProject(projectId);
    const formatted = await Promise.all(
      messages.map(async (msg: MessageDocument) => {
        const sender = await this._userRepository.findById(
          msg.senderId.toString(),
        );
        const avatarUrl = sender?.avatarKey
          ? await this._s3Service.createSignedUrl(sender.avatarKey)
          : undefined;
        const resolvedAttachments = await Promise.all(
          (msg.attachments || []).map(async (att) => ({
            ...att,
            fileUrl: await this._s3Service.createSignedUrl(att.fileKey),
          })),
        );
        return ChatMapper.toResponse(
          msg,
          sender,
          avatarUrl,
          resolvedAttachments,
        );
      }),
    );
    return { messages: formatted, total };
  }

  async updateMessage(
    senderId: string,
    messageId: string,
    dto: UpdateMessageDTO,
  ): Promise<MessageResponse> {
    const message = await this._chatRepository.findById(messageId);
    if (!message) {
      throw new NotFoundException(CHAT_MESSAGES.NOT_FOUND);
    }
    if (message.senderId.toString() !== senderId) {
      throw new ForbiddenException(CHAT_MESSAGES.FORBIDDEN_UPDATE);
    }
    const updated = await this._chatRepository.updateById(messageId, {
      content: dto.content,
      isEdited: true,
    } as Partial<MessageDocument>);
    if (!updated) {
      throw new NotFoundException(CHAT_MESSAGES.NOT_FOUND);
    }
    const sender = await this._userRepository.findById(senderId);
    const avatarUrl = sender?.avatarKey
      ? await this._s3Service.createSignedUrl(sender.avatarKey)
      : undefined;
    const resolvedAttachments = await Promise.all(
      (updated.attachments || []).map(async (att) => ({
        ...att,
        fileUrl: await this._s3Service.createSignedUrl(att.fileKey),
      })),
    );
    return ChatMapper.toResponse(
      updated,
      sender,
      avatarUrl,
      resolvedAttachments,
    );
  }

  async deleteMessage(senderId: string, messageId: string): Promise<void> {
    const message = await this._chatRepository.findById(messageId);
    if (!message) {
      throw new NotFoundException(CHAT_MESSAGES.NOT_FOUND);
    }
    if (message.senderId.toString() !== senderId) {
      throw new ForbiddenException(CHAT_MESSAGES.FORBIDDEN_DELETE);
    }
    await this._chatRepository.updateById(messageId, {
      content: 'This message is deleted',
      isDeleted: true,
      attachments: [],
    } as Partial<MessageDocument>);
  }

  async uploadAttachments(
    files: Express.Multer.File[],
    userId: string,
  ): Promise<AttachmentDTO[]> {
    const uploadedAttachments = await Promise.all(
      files.map(async (file) => {
        const { key } = await this._s3Service.uploadFile(
          file,
          userId,
          'chat_attachments',
        );
        const fileUrl = await this._s3Service.createSignedUrl(key);
        return {
          fileKey: key,
          fileName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          fileUrl: fileUrl,
        };
      }),
    );
    return uploadedAttachments;
  }
}
