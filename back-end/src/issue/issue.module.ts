import { Module } from '@nestjs/common';
import { IssueService } from './service/issue.service';
import { IssueController } from './controller/issue.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Issue, IssueSchema } from './Model/issue.schema';
import { IssueRepository } from './repository/IssueRepository';
import { ProjectModule } from 'src/project/project.module';
import { RoleModule } from 'src/role/role.module';
import { S3Module } from 'src/common/s3/s3.module';

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
