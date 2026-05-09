import { Module } from '@nestjs/common';
import { CommentService } from './service/comment.service';
import { CommentController } from './controller/comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './Model/comment.schema';
import { CommentRepository } from './repository/commentRepository';
import { IssueModule } from 'src/issue/issue.module';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    IssueModule,
    ProjectModule,
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
