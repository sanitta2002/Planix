import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { NotificationDocument } from '../Model/notification.schema';
import { Types } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
  namespace: 'notification',
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;
  constructor(private readonly _logger: PinoLogger) {}
  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId && Types.ObjectId.isValid(userId)) {
      await client.join(userId);
      this._logger.info(`user connect to notification socket: ${userId}`);
      console.log(`user connected`);
    } else {
      this._logger.warn('client connected without valid userId');
      console.log('client connected without userId');
    }
  }
  handleDisconnect(client: Socket) {
    this._logger.info(`user disconnected socket: ${client.id}`);
    console.log(`user disconnected : ${client.id}`);
  }
  sendNotification(receiverId: string, payload: NotificationDocument) {
    this.server.to(receiverId).emit('newNotification', payload);
  }
}
