import type { IJwtService } from '@/common/jwt/interfaces/jwt.service.interface';
import type { IProjectMemberRepository } from '@/project/interfaces/IProjectMemberRepository';
import { Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { PinoLogger } from 'nestjs-pino';
import { Server, Socket } from 'socket.io';
import { SendMessageDTO } from '@/chat/dto/req/SendMessageDTO';
import type { IChatService } from '@/chat/interface/IChatService';
import { JwtPayload } from '@/common/jwt/payload/JwtPayload';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;
  constructor(
    private readonly _logger: PinoLogger,
    @Inject('IJwtService') private readonly _jwtService: IJwtService,
    @Inject('IProjectMemberRepository')
    private readonly _projectMemberRepo: IProjectMemberRepository,
    @Inject('IChatService') private readonly _chatService: IChatService,
  ) {}
  handleConnection(client: Socket): void {
    const token =
      (client.handshake.auth?.token as string) ||
      (client.handshake.query?.token as string) ||
      (client.handshake.headers?.authorization?.split(' ')[1] as string);
    if (!token) {
      this._logger.warn('chat connection rejected: missing JWT token');
      console.log('chat connection rejected');
      client.disconnect(true);
      return;
    }
    const payload = this._jwtService.verifyAccessToken(token);
    if (!payload) {
      this._logger.warn('chat connection rejected: Invalid token');
      console.log('chat connetion rejected');
      client.disconnect(true);
      return;
    }
    const socketData = client.data as { user?: JwtPayload };
    socketData.user = payload;
    this._logger.info(`user ${payload.userId} authorized on chat`);
    console.log(`user ${payload.userId} authorized`);
  }
  handleDisconnect(client: Socket): void {
    this._logger.info(`user socket disconnected: ${client.id}`);
    console.log('user socket disconnected');
  }
  @SubscribeMessage('joinProjectRoom')
  async handleJoinProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { projectId: string },
  ): Promise<void> {
    const socketData = client.data as { user?: JwtPayload };
    const userId = socketData.user?.userId;
    const { projectId } = payload;
    if (!projectId || !userId) {
      client.emit('error', { message: 'Invalid payload context' });
      return;
    }
    const isMember = await this._projectMemberRepo.findProjectAndUser(
      projectId,
      userId,
    );
    if (!isMember) {
      this._logger.warn(
        `unauthorized join attempt user ${userId} to project room ${projectId}`,
      );
      client.emit('error', { message: 'Unauthorized room access' });
      return;
    }
    const roomName = `project_room_${projectId}`;
    await client.join(roomName);
    this._logger.info(`user successfully joined chat room: ${roomName}`);
    console.log('****user successfully');
    client.emit('joinedRoom', {
      projectId,
      message: 'successfully joined room',
    });
  }
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: SendMessageDTO,
  ): Promise<void> {
    const socketData = client.data as { user?: JwtPayload };
    const userId = socketData.user?.userId;
    if (!userId) {
      client.emit('error', { message: 'Unauthorized session' });
      return;
    }
    try {
      const savedMessage = await this._chatService.sendMessage(userId, dto);
      const roomName = `project_room_${dto.projectId}`;
      this.server.to(roomName).emit('newMessage', savedMessage);
    } catch (error) {
      this._logger.error('failed real-time message sending', error);
      client.emit('error', { message: 'message not be processed' });
    }
  }
}
