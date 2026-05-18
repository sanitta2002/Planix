import { Module } from '@nestjs/common';

import { SprintController } from '@/sprint/controller/sprint.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sprint, SprintSchema } from '@/sprint/Model/sprint.schema';
import { SprintService } from '@/sprint/service/sprint.service';
import { SprintRepository } from '@/sprint/repository/sprintRepository';
import { IssueModule } from '@/issue/issue.module';
import { ProjectModule } from '@/project/project.module';
import { RoleModule } from '@/role/role.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sprint.name, schema: SprintSchema }]),
    IssueModule,
    ProjectModule,
    RoleModule,
  ],
  providers: [
    {
      provide: 'Isprintservice',
      useClass: SprintService,
    },

    {
      provide: 'IsprintRepository',
      useClass: SprintRepository,
    },
  ],

  controllers: [SprintController],
  exports: ['Isprintservice', 'IsprintRepository'],
})
export class SprintModule {}
