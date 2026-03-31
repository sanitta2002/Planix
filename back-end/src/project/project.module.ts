import { Module } from '@nestjs/common';
import { ProjectController } from './controller/project.controller';
import { ProjectService } from './service/project.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './Model/project.schema';
import { ProjectRepository } from './repository/project.repository';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import {
  ProjectMember,
  ProjectMemberSchema,
} from './Model/ProjectMember/projectMember.schema';
import { RoleModule } from 'src/role/role.module';
import { ProjectMemberRepository } from './repository/ProjectMember/ProjectMemberRepository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([
      { name: ProjectMember.name, schema: ProjectMemberSchema },
    ]),
    WorkspaceModule,
    RoleModule,
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
  controllers: [ProjectController],
})
export class ProjectModule {}
