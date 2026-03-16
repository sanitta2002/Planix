import { forwardRef, Module } from '@nestjs/common';
import { WorkspaceService } from './service/workspace.service';
import { WorkspaceController } from './controller/workspace.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Workspace, WorkspaceSchema } from './Model/workspace.schema';
import { WorkspaceRepository } from './Repository/workspace.repository';
import { S3Module } from 'src/common/s3/s3.module';
import { SubscriptionsModule } from 'src/subscription/subscriptions/subscriptions.module';
import { SubscriptionPlanModule } from 'src/subscription/subscription-plan/subscription-plan.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workspace.name, schema: WorkspaceSchema },
    ]),
    S3Module,
    forwardRef(() => SubscriptionsModule),
    SubscriptionPlanModule,
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
