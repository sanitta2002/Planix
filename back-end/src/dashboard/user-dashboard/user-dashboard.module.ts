import { Module } from '@nestjs/common';
import { UserDashboardController } from '@/dashboard/user-dashboard/controller/user-dashboard.controller';
import { UserDashboardService } from '@/dashboard/user-dashboard/service/user-dashboard.service';
import { ProjectModule } from '@/project/project.module';
import { IssueModule } from '@/issue/issue.module';
import { SprintModule } from '@/sprint/sprint.module';
import { UsersModule } from '@/users/users.module';
import { WorkspaceModule } from '@/workspace/workspace.module';
import { S3Module } from '@/common/s3/s3.module';

@Module({
  imports: [
    ProjectModule,
    IssueModule,
    SprintModule,
    UsersModule,
    WorkspaceModule,
    S3Module,
  ],
  controllers: [UserDashboardController],
  providers: [UserDashboardService],
})
export class UserDashboardModule {}
