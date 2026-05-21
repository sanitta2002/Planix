import { Module } from '@nestjs/common';
import { IssueService } from '@/issue/service/issue.service';
import { IssueController } from '@/issue/controller/issue.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Issue, IssueSchema } from '@/issue/Model/issue.schema';
import { IssueRepository } from '@/issue/repository/IssueRepository';
import { ProjectModule } from '@/project/project.module';
import { RoleModule } from '@/role/role.module';
import { S3Module } from '@/common/s3/s3.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Issue.name, schema: IssueSchema }]),
    ProjectModule,
    RoleModule,
    S3Module,
  ],
  providers: [
    {
      provide: 'IIssueService',
      useClass: IssueService,
    },
    {
      provide: 'IIssueRepository',
      useClass: IssueRepository,
    },
  ],
  exports: ['IIssueRepository'],
  controllers: [IssueController],
})
export class IssueModule {}
