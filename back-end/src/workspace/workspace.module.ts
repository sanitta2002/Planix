import { Module } from '@nestjs/common';
import { WorkspaceService } from './service/workspace.service';
import { WorkspaceController } from './controller/workspace.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Workspace, WorkspaceSchema } from './Model/workspace.schema';
import { WorkspaceRepository } from './Repository/workspace.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workspace.name, schema: WorkspaceSchema },
    ]),
  ],
  providers: [
    {
      provide: 'IWorkspaceRepository',
      useClass: WorkspaceRepository,
    },

    {
      provide: 'IWorkspaceService',
      useClass: WorkspaceService,
    },
  ],
  controllers: [WorkspaceController],
  exports: ['IWorkspaceRepository', 'IWorkspaceService'],
})
export class WorkspaceModule {}
