import { Module } from '@nestjs/common';
import { ProjectController } from '@/project/controller/project.controller';
import { ProjectService } from '@/project/service/project.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from '@/project/Model/project.schema';
import { ProjectRepository } from '@/project/repository/project.repository';
import { WorkspaceModule } from '@/workspace/workspace.module';
import {
  ProjectMember,
  ProjectMemberSchema,
} from '@/project/Model/ProjectMember/projectMember.schema';
import { RoleModule } from '@/role/role.module';
import { ProjectMemberRepository } from '@/project/repository/ProjectMember/ProjectMemberRepository';
import { SubscriptionsModule } from '@/subscription/subscriptions/subscriptions.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([
      { name: ProjectMember.name, schema: ProjectMemberSchema },
    ]),
    WorkspaceModule,
    RoleModule,
    SubscriptionsModule,
  ],
  providers: [
    {
      provide: 'IProjectService',
      useClass: ProjectService,
    },
    {
      provide: 'IprojectRepository',
      useClass: ProjectRepository,
    },
    {
      provide: 'IProjectMemberRepository',
      useClass: ProjectMemberRepository,
    },
  ],
  exports: ['IprojectRepository', 'IProjectMemberRepository'],
  controllers: [ProjectController],
})
export class ProjectModule {}
