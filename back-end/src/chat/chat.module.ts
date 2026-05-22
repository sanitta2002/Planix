import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from '@/chat/service/chat.service';
import { ChatController } from '@/chat/controller/chat.controller';
import { ChatRepository } from '@/chat/repository/ChatRepository';
import { Message, MessageSchema } from '@/chat/Model/message.schema';
import { UsersModule } from '@/users/users.module';
import { S3Module } from '@/common/s3/s3.module';
import { ProjectModule } from '@/project/project.module';
import { AppJwtModule } from '@/common/jwt/jwt.module';
import { ChatGateway } from './gateway/chat.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    UsersModule,
    S3Module,
    ProjectModule,
    AppJwtModule,
  ],
  providers: [
    ChatGateway,
    {
      provide: 'IChatService',
      useClass: ChatService,
    },
    {
      provide: 'IChatRepository',
      useClass: ChatRepository,
    },
  ],
  exports: ['IChatRepository', 'IChatService'],
  controllers: [ChatController],
})
export class ChatModule {}
