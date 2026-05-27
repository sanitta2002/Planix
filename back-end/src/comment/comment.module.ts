import { Module } from '@nestjs/common';
import { CommentService } from '@/comment/service/comment.service';
import { CommentController } from '@/comment/controller/comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from '@/comment/Model/comment.schema';
import { CommentRepository } from '@/comment/repository/commentRepository';
import { IssueModule } from '@/issue/issue.module';
import { ProjectModule } from '@/project/project.module';
import { LoggerModule } from '@/logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    IssueModule,
    ProjectModule,
    LoggerModule,
  ],
  providers: [
    {
      provide: 'ICommentService',
      useClass: CommentService,
    },

    {
      provide: 'ICommentRepository',
      useClass: CommentRepository,
    },
  ],
  controllers: [CommentController],
})
export class CommentModule {}
