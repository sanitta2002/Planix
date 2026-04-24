import { Module } from '@nestjs/common';

import { SprintController } from './controller/sprint.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sprint, SprintSchema } from './Model/sprint.schema';
import { SprintService } from './service/sprint.service';
import { SprintRepository } from './repository/sprintRepository';
import { IssueModule } from 'src/issue/issue.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sprint.name, schema: SprintSchema }]),
    IssueModule,
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
  exports: ['Isprintservice'],
})
export class SprintModule {}
