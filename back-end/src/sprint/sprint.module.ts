import { Module } from '@nestjs/common';

import { SprintController } from './controller/sprint.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sprint, SprintSchema } from './Model/sprint.schema';
import { SprintService } from './service/sprint.service';
import { SprintRepository } from './repository/sprintRepository';
import { IssueModule } from 'src/issue/issue.module';
import { ProjectModule } from 'src/project/project.module';
import { RoleModule } from 'src/role/role.module';

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
